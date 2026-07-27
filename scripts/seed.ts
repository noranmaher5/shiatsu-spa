/* eslint-disable no-console -- this is a CLI script; console output IS the UI. */
/**
 * Firestore database seeder.
 *
 * Populates every collection the app reads from:
 *   settings, categories, services, branches, gallery, faq, testimonials
 *
 * Content lives in `scripts/seed-data.ts`, never inline here — this
 * file only knows how to WRITE data, not what the data is.
 *
 * Usage:
 *   npm run seed
 *
 * Requires the same Firebase Admin env vars as the rest of the app
 * (FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL,
 * FIREBASE_ADMIN_PRIVATE_KEY — see .env.example) available in
 * .env.local. Run with `tsx`. Uses `scripts/lib/admin.ts` for its own
 * Admin SDK init rather than `lib/firebase/admin.ts` — see that
 * file's header comment for why.
 *
 * Safe to re-run:
 *   - `settings/{hero,company,contact,social,seo,website}` are fixed
 *     document IDs and are upserted with `{ merge: true }`, so
 *     existing fields not present in the seed data are preserved
 *     rather than wiped.
 *   - `categories`, `services`, `branches`, `gallery`, `faq`, and
 *     `testimonials` use Firestore auto-generated IDs. To keep re-runs
 *     idempotent (no duplicate documents piling up on every run),
 *     each of those collections is fully cleared and rewritten in a
 *     batch, so the collection always ends up matching seed-data.ts
 *     exactly. This script is meant for initial/staging setup — avoid
 *     running it against a database with admin-authored content you
 *     want to keep, since a rerun replaces every document in the
 *     six collections above.
 */

import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";
import { FieldValue, type WriteBatch } from "firebase-admin/firestore";

// Next.js auto-loads .env.local; a standalone tsx script doesn't, so
// load it explicitly before importing ./lib/admin (which reads
// process.env at module-init time).
loadEnv({ path: resolve(process.cwd(), ".env.local") });
const { adminDb } = await import("./lib/admin");
import {
  heroSettingsSeed,
  companySettingsSeed,
  contactSettingsSeed,
  socialSettingsSeed,
  seoSettingsSeed,
  websiteSettingsSeed,
  categoriesSeed,
  servicesSeed,
  branchesSeed,
  gallerySeed,
  faqSeed,
  testimonialsSeed,
  serviceEnglishNames,
  type CategorySeed,
} from "./seed-data";

// Firestore batches are capped at 500 writes; every collection here is
// small, but chunking keeps this correct even if seed-data.ts grows.
const BATCH_LIMIT = 450;

/** Deletes every existing document in `collection`, then writes
 * `docs` back with fresh auto-generated IDs, chunked into batches
 * under Firestore's 500-write limit. Used for every collection that
 * doesn't have fixed document IDs, so re-running the seed produces a
 * clean, duplicate-free collection instead of appending forever. */
async function reseedCollection(
  collectionName: string,
  docs: Record<string, unknown>[],
): Promise<void> {
  const collectionRef = adminDb.collection(collectionName);

  const existing = await collectionRef.listDocuments();
  const operations: Array<(batch: WriteBatch) => void> = [
    ...existing.map((ref) => (batch: WriteBatch) => batch.delete(ref)),
    ...docs.map((data) => (batch: WriteBatch) => {
      const ref = collectionRef.doc();
      batch.set(ref, {
        ...data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }),
  ];

  for (let i = 0; i < operations.length; i += BATCH_LIMIT) {
    const batch = adminDb.batch();
    operations.slice(i, i + BATCH_LIMIT).forEach((op) => op(batch));
    await batch.commit();
  }
}

/** Upserts a single fixed-ID `/settings/{id}` document with `{ merge:
 * true }`, matching the same write shape the admin dashboard's save
 * actions use (features/settings/actions.ts), so seeded documents
 * look identical to admin-saved ones. */
async function upsertSettingsDoc(
  id: string,
  data: Record<string, unknown>,
): Promise<void> {
  await adminDb
    .collection("settings")
    .doc(id)
    .set({ ...data, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}

async function seedSettings(): Promise<void> {
  await upsertSettingsDoc("hero", heroSettingsSeed);
  await upsertSettingsDoc("company", companySettingsSeed);
  await upsertSettingsDoc("contact", contactSettingsSeed);
  await upsertSettingsDoc("social", socialSettingsSeed);
  await upsertSettingsDoc("seo", seoSettingsSeed);
  await upsertSettingsDoc("website", websiteSettingsSeed);
  console.log("✓ Settings seeded (hero, company, contact, social, seo, website)");
}

/** Returns a lookup of category slug → assigned Firestore document ID,
 * so services can be written with a real `categoryId` even though
 * category IDs are auto-generated fresh on every run. */
async function seedCategories(): Promise<Map<string, string>> {
  const collectionRef = adminDb.collection("categories");
  const existing = await collectionRef.listDocuments();

  const slugToId = new Map<string, string>();
  const operations: Array<(batch: WriteBatch) => void> = existing.map(
    (ref) => (batch: WriteBatch) => batch.delete(ref),
  );

  categoriesSeed.forEach((category: CategorySeed) => {
    const ref = collectionRef.doc();
    slugToId.set(category.slug, ref.id);
    operations.push((batch) => {
      batch.set(ref, {
        name: category.name,
        slug: category.slug,
        order: category.order,
        isActive: category.isActive,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    });
  });

  for (let i = 0; i < operations.length; i += BATCH_LIMIT) {
    const batch = adminDb.batch();
    operations.slice(i, i + BATCH_LIMIT).forEach((op) => op(batch));
    await batch.commit();
  }

  console.log(`✓ Categories seeded (${categoriesSeed.length})`);
  return slugToId;
}

async function seedServices(categoryIdBySlug: Map<string, string>): Promise<void> {
  const docs = servicesSeed.map((service, index) => {
    const categoryId = categoryIdBySlug.get(service.categorySlug);
    if (!categoryId) {
      throw new Error(
        `Service "${service.slug}" references unknown category slug "${service.categorySlug}". ` +
          "Add it to categoriesSeed in seed-data.ts first.",
      );
    }

    return {
      name: { en: serviceEnglishNames[service.slug] ?? service.slug, ar: service.nameAr },
      slug: service.slug,
      shortDescription: null,
      description: {
        en: `${serviceEnglishNames[service.slug] ?? "Wellness treatment"} designed to ease tension, restore balance, and leave you feeling deeply refreshed.`,
        ar: service.nameAr,
      },
      price: service.price,
      durationMinutes: service.durationMinutes,
      categoryId,
      imageUrl: null,
      isFeatured: index < 6,
      isActive: service.isActive,
      order: index,
    };
  });

  await reseedCollection("services", docs);
  console.log(`✓ Services seeded (${docs.length})`);
}

async function seedBranches(): Promise<void> {
  const docs = branchesSeed.map((branch, index) => ({ ...branch, order: index }));
  await reseedCollection("branches", docs);
  console.log(`✓ Branches seeded (${docs.length})`);
}

async function seedGallery(): Promise<void> {
  const docs = gallerySeed.map((item, index) => ({ ...item, order: index }));
  await reseedCollection("gallery", docs);
  console.log(`✓ Gallery seeded (${docs.length})`);
}

async function seedFaq(): Promise<void> {
  const docs = faqSeed.map((item, index) => ({ ...item, order: index }));
  await reseedCollection("faq", docs);
  console.log(`✓ FAQ seeded (${docs.length})`);
}

async function seedTestimonials(): Promise<void> {
  const docs = testimonialsSeed.map((item, index) => ({ ...item, order: index }));
  await reseedCollection("testimonials", docs);
  console.log(`✓ Testimonials seeded (${docs.length})`);
}

async function main(): Promise<void> {
  console.log("Seeding Firestore database…\n");

  const categoryIdBySlug = await seedCategories();
  await seedServices(categoryIdBySlug);
  await seedBranches();
  await seedGallery();
  await seedFaq();
  await seedTestimonials();
  await seedSettings();

  console.log("\n✓ Database completed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n✗ Seeding failed:", error);
    process.exit(1);
  });
