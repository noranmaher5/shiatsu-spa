/**
 * Seed data for `scripts/seed.ts`.
 *
 * Where content already exists from the client's "Website Content
 * Collection Form" (company info, contact numbers, social links,
 * services, categories, branches), it is copied here verbatim/derived
 * — this is real client content, not placeholder or dummy data.
 *
 * Where the form's sheet was still showing the template's example row
 * (Home Page hero, Gallery, FAQ, SEO) or had no sheet at all
 * (Testimonials), that section is left as an explicit `TODO_*`
 * placeholder below. Replace those before going live — search this
 * file for "TODO" to find every spot that still needs real content.
 *
 * Source: Website_Content_Collection_Form.xlsx (as supplied by the
 * client). Prices/durations were normalized from the sheet's mixed
 * formats (e.g. "15 KWD" → 15, "20-30 min" → 25) but the underlying
 * numbers are the client's own figures, not invented ones.
 */

import type { Bilingual } from "@/types";

const TODO_EN = "[TODO: add English translation]";
const TODO_AR = "[TODO: أضف الترجمة العربية]";

/** Marks a bilingual field where only one language has real content
 * so far. Keeps the placeholder text obviously non-final in the admin
 * UI rather than silently shipping an empty string. */
function bilingual(en: string | null, ar: string | null): Bilingual {
  return { en: en ?? TODO_EN, ar: ar ?? TODO_AR };
}

// ---------------------------------------------------------------------------
// SETTINGS — fixed document IDs: hero, company, contact, social, seo, website
// ---------------------------------------------------------------------------

export const heroSettingsSeed = {
  // TODO: Home Page sheet in the client's form still had the template's
  // example content ("Look Sharp. Feel Confident." — a barbershop example)
  // rather than Shiatsu Spa's own hero copy. Replace all fields below
  // once the client sends their real homepage banner text.
  title: bilingual("Relax, Recharge,", "استرخِ، استعد طاقتك،"),
  subtitle: bilingual(
    "Luxury wellness tailored for gentlemen — therapeutic touch in a private, discreet retreat.",
    "تجربة عناية فاخرة مصممة خصيصًا للرجال، بلمسة علاجية خاصة وخصوصية تامة في الكويت.",
  ),
  buttonText: bilingual("Book Now", "احجز الآن"),
  // Real WhatsApp number from the Contact Info sheet (first branch).
  buttonLink: "https://wa.me/96566555872",
  backgroundImageUrl: null, // TODO: awaiting hero background image asset
};

export const companySettingsSeed = {
  name: bilingual("Shiatsu Spa", "شياتسو سبا"),
  slogan: bilingual("Where Style Meets Tradition", "Where Style Meets Tradition"),
  aboutUs: bilingual(
    "Shiatsu Spa is an integrated men's destination for grooming and relaxation in Kuwait, combining authentic therapeutic techniques with modern luxury standards. We are not just a grooming place; we are a space designed for the man who values his time and seeks a real result: physical relaxation, mental clarity, and genuine recovery.\nSince opening in 2023, we have built our reputation on precision, complete privacy, and a level of service worthy of clients who expect the best and accept nothing less.",
    "شياتسو سبا هو وجهة رجالية متكاملة للعناية والاسترخاء في الكويت، تجمع بين أصالة تقنيات العلاج وأحدث معايير الرفاهية الحديثة. لسنا مجرد مكان للتدليك؛ نحن مساحة مصممة خصيصًا لرجل يقدّر وقته ويبحث عن نتيجة حقيقية: استرخاء جسدي، وضوح ذهني، وتعافٍ فعلي.\nمنذ انطلاقتنا في عام 2023، بنينا سمعتنا على الدقة في التنفيذ، والخصوصية التامة، ومستوى خدمة يليق بعملاء يتوقعون الأفضل ولا يقبلون بأقل منه.",
  ),
  vision: bilingual(
    "Our vision is for Shiatsu Spa to become Kuwait's leading men's wellness brand, delivering an elevated relaxation experience built on high quality and a commitment to Islamic values, and to become a recognized Gulf brand in men's spa services.",
    "أن يكون شياتسو سبا العلامة الرجالية الأولى بالكويت في تقديم تجربة استرخاء راقية، قائمة على الجودة العالية والالتزام بالقيم الإسلامية، وأن يتحول إلى علامة خليجية معروفة في مجال سبا الرجال.",
  ),
  mission: bilingual(
    "To provide luxurious therapeutic and relaxation services with a professional approach, using natural and safe products in a comfortable and Sharia-compliant environment, with the goal of restoring balance to body, mind, and spirit.",
    "تقديم خدمات علاجية واسترخائية فاخرة بأسلوب احترافي، باستخدام منتجات طبيعية وآمنة في بيئة مريحة وشرعية، تهدف إلى تحقيق توازن الجسد والعقل والروح.",
  ),
  // NOTE: aboutUs/vision/mission are Arabic-only in the client's form —
  // `en` sides are TODO_EN until an English translation is supplied.
};

export const contactSettingsSeed = {
  // Both branches' numbers from the Contact Info sheet.
  phones: ["+96560074005", "+96566555297"],
  whatsapp: "+96566555872",
  email: "shiatsuspa.kw@gmail.com",
};

export const socialSettingsSeed = {
  instagram: "https://www.instagram.com/shiatsuspa.kw?igsh=eWJzdDkydTV3MDgw",
  snapchat:
    "https://www.snapchat.com/add/shiatsuspa.kw?share_id=y6pnfAttdic&locale=en-GB",
  tiktok: "https://www.tiktok.com/@shiatsuspa.kw?_r=1&_t=ZS-98BZZ5dLa4Y",
  twitter: null, // form had "-" (not provided)
  facebook: null, // form had "-" (not provided)
  website: null, // form had "-" (not provided)
};

export const seoSettingsSeed = {
  // TODO: SEO sheet still had the template's example content
  // (a barbershop example, unrelated to Shiatsu Spa). Replace once
  // the client sends real SEO copy/keywords.
  metaTitle: bilingual(null, null),
  metaDescription: bilingual(null, null),
  keywords: [] as string[], // TODO: awaiting real keyword list
  ogImageUrl: null, // TODO: awaiting OG image asset
  faviconUrl: null, // TODO: awaiting favicon asset
};

export const websiteSettingsSeed = {
  googleAnalyticsId: null, // optional, not yet supplied
  metaPixelId: null, // optional, not yet supplied
  businessHours: bilingual(
    "Every day from 9:00 AM to 5:00 AM",
    "يوميًا من 9:00 صباحًا حتى 5:00 صباحًا",
  ),
  emergencyContact: null,
  logoUrl: null, // TODO: awaiting logo asset
};

// ---------------------------------------------------------------------------
// CATEGORIES — auto-generated IDs, matched by slug on re-seed
// ---------------------------------------------------------------------------

export type CategorySeed = {
  slug: string;
  name: Bilingual;
  order: number;
  isActive: boolean;
};

// Names are the exact category labels used in the Services sheet.
// English sides are TODO — the sheet only used English category labels
// already (they double as the `en` name), Arabic sides need translation.
export const categoriesSeed: CategorySeed[] = [
  { slug: "massage", name: bilingual("Massage", null), order: 0, isActive: true },
  { slug: "head-face", name: bilingual("Head & Face", null), order: 1, isActive: true },
  { slug: "feet-care", name: bilingual("Feet Care", null), order: 2, isActive: true },
  {
    slug: "cupping-therapy",
    name: bilingual("Cupping Therapy", null),
    order: 3,
    isActive: true,
  },
  { slug: "baths", name: bilingual("Baths", null), order: 4, isActive: true },
  { slug: "facial", name: bilingual("Facial", null), order: 5, isActive: true },
];

// ---------------------------------------------------------------------------
// SERVICES — auto-generated IDs; categoryId is resolved at seed time from
// `categorySlug` after categories are written (see scripts/seed.ts).
// ---------------------------------------------------------------------------

export type ServiceSeed = {
  slug: string;
  nameAr: string;
  categorySlug: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
};

export const serviceEnglishNames: Record<string, string> = {
  "massage-01": "Relax Massage",
  "massage-02": "Shiatsu Massage",
  "massage-03": "Swedish Massage",
  "massage-04": "Thai Massage",
  "massage-05": "Aroma Massage",
  "massage-06": "Reflexology Massage",
  "massage-07": "Balinese Massage",
  "massage-08": "Lomi Lomi Massage",
  "massage-09": "Therapeutic Massage",
  "massage-10": "Sports Massage",
  "massage-11": "Deep Tissue Massage",
  "massage-12": "Hot Stone Massage",
  "massage-13": "Bamboo Massage",
  "massage-14": "Fire Massage",
  "massage-15": "Special Oils Massage",
  "massage-16": "Herbal Pressure Massage",
  "massage-17": "Swedish & Shiatsu Massage",
  "massage-18": "Sports & Shiatsu Massage",
  "massage-19": "Hot Stone & Swedish Massage",
  "massage-20": "Four Hands Massage",
  "massage-21": "Deep Tissue & Sports Massage",
  "massage-22": "Fire & Swedish Massage",
  "massage-23": "Arabic Heritage Massage",
  "massage-24": "Shiatsu Massage",
  "massage-25": "Slimming Massage",
  "massage-26": "Lymphatic Drainage Massage",
  "massage-27": "Lymphatic Drainage & Fire Massage",
  "head-face-01": "Japanese Herbal Head Treatment",
  "head-face-02": "Hair Treatment",
  "head-face-03": "Head & Face Massage",
  "head-face-04": "Ear Candle Treatment",
  "feet-care-01": "Foot Massage",
  "feet-care-02": "Hot Stone Foot Treatment",
  "cupping-therapy-01": "Air Cupping",
  "cupping-therapy-02": "Fire Cupping",
  "cupping-therapy-03": "Bamboo Cupping",
  "baths-01": "Moroccan Nile Bath & Fassi Scrub",
  "baths-02": "Oud & Sandalwood Bath",
  "baths-03": "Tunisian Bath",
  "baths-04": "VIP Gold Bath",
  "facial-01": "Face Mask",
  "facial-02": "Deep Skin Cleansing",
  "facial-03": "Collagen Cleansing",
  "facial-04": "Gold Facial",
  "facial-05": "Diamond Facial",
  "feet-care-03": "Pedicure",
  "feet-care-04": "Manicure",
  "feet-care-05": "Pedicure & Manicure",
};

/**
 * Every row from the Services sheet. `nameAr` is the client's real
 * service name; there is no English name in the sheet yet, so
 * `name.en` is filled with TODO_EN at write time in scripts/seed.ts.
 * Prices/durations are normalized (see file header) but sourced from
 * the sheet, not invented. `isActive` reflects the sheet's
 * "Available (Yes/No)" column — rows left blank default to `true`
 * since every row is a service the client explicitly listed as
 * offered; only an explicit "No" would flip this to `false` (none
 * were marked "No" in the current form).
 */
export const servicesSeed: ServiceSeed[] = [
  {
    slug: "massage-01",
    nameAr: "مساج ريلاكس",
    categorySlug: "massage",
    price: 12.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-02",
    nameAr: "أشياتسو",
    categorySlug: "massage",
    price: 15.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-03",
    nameAr: "سويدي",
    categorySlug: "massage",
    price: 15.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-04",
    nameAr: "تايلندي",
    categorySlug: "massage",
    price: 15.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-05",
    nameAr: "اروما",
    categorySlug: "massage",
    price: 15.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-06",
    nameAr: "ريفلكسولوجي",
    categorySlug: "massage",
    price: 15.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-07",
    nameAr: "بالي",
    categorySlug: "massage",
    price: 15.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-08",
    nameAr: "لومي لومي",
    categorySlug: "massage",
    price: 15.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-09",
    nameAr: "علاجي",
    categorySlug: "massage",
    price: 18.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-10",
    nameAr: "رياضي",
    categorySlug: "massage",
    price: 15.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-11",
    nameAr: "ضغط عميق",
    categorySlug: "massage",
    price: 18.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-12",
    nameAr: "أحجار ساخنة",
    categorySlug: "massage",
    price: 18.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-13",
    nameAr: "بامبو",
    categorySlug: "massage",
    price: 20.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-14",
    nameAr: "مساج النار",
    categorySlug: "massage",
    price: 20.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-15",
    nameAr: "زيوت خاصة",
    categorySlug: "massage",
    price: 18.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-16",
    nameAr: "الضغط بالأعشاب",
    categorySlug: "massage",
    price: 25.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-17",
    nameAr: "سويدي + أشياتسو",
    categorySlug: "massage",
    price: 18.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-18",
    nameAr: "رياضي + أشياتسو",
    categorySlug: "massage",
    price: 18.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-19",
    nameAr: "أحجار ساخنة + سويدي",
    categorySlug: "massage",
    price: 29.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-20",
    nameAr: "الأيدي الأربعة",
    categorySlug: "massage",
    price: 45.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-21",
    nameAr: "ضغط عميق + رياضي",
    categorySlug: "massage",
    price: 18.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-22",
    nameAr: "مساج النار + سويدي",
    categorySlug: "massage",
    price: 29.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-23",
    nameAr: "مساج التراث العربي",
    categorySlug: "massage",
    price: 29.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-24",
    nameAr: "شياتسو",
    categorySlug: "massage",
    price: 15.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-25",
    nameAr: "مساج تخسيس",
    categorySlug: "massage",
    price: 22.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-26",
    nameAr: "دهون ليمفاوية",
    categorySlug: "massage",
    price: 39.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "massage-27",
    nameAr: "دهون ليمفاوية + نار",
    categorySlug: "massage",
    price: 49.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "head-face-01",
    nameAr: "مساج العشب الياباني",
    categorySlug: "head-face",
    price: 39.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "head-face-02",
    nameAr: "علاج الشعر",
    categorySlug: "head-face",
    price: 19.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "head-face-03",
    nameAr: "مساج الرأس والوجه",
    categorySlug: "head-face",
    price: 12.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "head-face-04",
    nameAr: "شمع الأذن",
    categorySlug: "head-face",
    price: 6.0,
    durationMinutes: 15,
    isActive: true,
  },
  {
    slug: "feet-care-01",
    nameAr: "مساج القدم",
    categorySlug: "feet-care",
    price: 10.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "feet-care-02",
    nameAr: "قدم ملح النار",
    categorySlug: "feet-care",
    price: 12.0,
    durationMinutes: 60,
    isActive: true,
  },
  {
    slug: "cupping-therapy-01",
    nameAr: "كاسات هواء",
    categorySlug: "cupping-therapy",
    price: 5.0,
    durationMinutes: 15,
    isActive: true,
  },
  {
    slug: "cupping-therapy-02",
    nameAr: "كاسات النار",
    categorySlug: "cupping-therapy",
    price: 6.0,
    durationMinutes: 15,
    isActive: true,
  },
  {
    slug: "cupping-therapy-03",
    nameAr: "كاسات بامبو",
    categorySlug: "cupping-therapy",
    price: 7.0,
    durationMinutes: 15,
    isActive: true,
  },
  {
    slug: "baths-01",
    nameAr: "حمام بالنيلة المغربية والعكر الفاسي",
    categorySlug: "baths",
    price: 10.0,
    durationMinutes: 25,
    isActive: true,
  },
  {
    slug: "baths-02",
    nameAr: "حمام  بالعود والصندل",
    categorySlug: "baths",
    price: 15.0,
    durationMinutes: 35,
    isActive: true,
  },
  {
    slug: "baths-03",
    nameAr: "حمام تونسي",
    categorySlug: "baths",
    price: 19.0,
    durationMinutes: 25,
    isActive: true,
  },
  {
    slug: "baths-04",
    nameAr: "حمام الذهب VIP",
    categorySlug: "baths",
    price: 25.0,
    durationMinutes: 25,
    isActive: true,
  },
  {
    slug: "facial-01",
    nameAr: "قناع الوجه",
    categorySlug: "facial",
    price: 6.0,
    durationMinutes: 38,
    isActive: true,
  },
  {
    slug: "facial-02",
    nameAr: "تنظيف بشرة",
    categorySlug: "facial",
    price: 12.0,
    durationMinutes: 38,
    isActive: true,
  },
  {
    slug: "facial-03",
    nameAr: "تنظيف كولاجين",
    categorySlug: "facial",
    price: 19.0,
    durationMinutes: 38,
    isActive: true,
  },
  {
    slug: "facial-04",
    nameAr: "تنظيف الذهب",
    categorySlug: "facial",
    price: 20.0,
    durationMinutes: 38,
    isActive: true,
  },
  {
    slug: "facial-05",
    nameAr: "تنظيف الألماس",
    categorySlug: "facial",
    price: 35.0,
    durationMinutes: 38,
    isActive: true,
  },
  {
    slug: "feet-care-03",
    nameAr: "بديكير",
    categorySlug: "feet-care",
    price: 6.0,
    durationMinutes: 38,
    isActive: true,
  },
  {
    slug: "feet-care-04",
    nameAr: "منيكير",
    categorySlug: "feet-care",
    price: 6.0,
    durationMinutes: 38,
    isActive: true,
  },
  {
    slug: "feet-care-05",
    nameAr: "بديكير ومنيكير",
    categorySlug: "feet-care",
    price: 10.0,
    durationMinutes: 60,
    isActive: true,
  },
];

// ---------------------------------------------------------------------------
// BRANCHES — auto-generated IDs
// ---------------------------------------------------------------------------

export type BranchSeed = {
  name: Bilingual;
  address: Bilingual;
  phone: string;
  whatsapp: string;
  workingHours: Bilingual;
  coverImageUrl: string | null;
  googleMapsUrl: string;
  latitude: number;
  longitude: number;
  order: number;
  isActive: boolean;
};

// The two rows from the Contact Info sheet — each row is one physical
// branch (own phone/address/maps link), sharing the same working hours.
export const branchesSeed: BranchSeed[] = [
  {
    name: bilingual(null, "فرع صباح السالم"),
    address: bilingual(null, "صباح السالم، برج اورانج، مقابل نادي اكسجين"),
    phone: "+96560074005",
    whatsapp: "+96566555872",
    workingHours: bilingual(
      "Every day from 9:00 AM to 5:00 AM",
      "يوميًا من 9:00 صباحًا حتى 5:00 صباحًا",
    ),
    coverImageUrl: null, // TODO: awaiting branch cover image
    googleMapsUrl: "https://maps.app.goo.gl/uhrr22otGHqbXKZT7?g_st=ac",
    latitude: 29.26675,
    longitude: 48.083008,
    order: 0,
    isActive: true,
  },
  {
    name: bilingual(null, "فرع الرقعي"),
    address: bilingual(null, "الرقعي، على الدائري الرابع، بجانب نادي اكسجين"),
    phone: "+96566555297",
    whatsapp: "+96566555872",
    workingHours: bilingual(
      "Every day from 9:00 AM to 5:00 AM",
      "يوميًا من 9:00 صباحًا حتى 5:00 صباحًا",
    ),
    coverImageUrl: null, // TODO: awaiting branch cover image
    googleMapsUrl: "https://maps.app.goo.gl/9RiaJu2E6bziUvSN6?g_st=ac",
    latitude: 29.3094167,
    longitude: 47.9163324,
    order: 1,
    isActive: true,
  },
];

// ---------------------------------------------------------------------------
// GALLERY — auto-generated IDs
// TODO: the Gallery sheet only had the template's example row
// ("shop-interior-1.jpg" — a generic barbershop example), no real
// images/descriptions from the client yet. Populate this array once
// the client sends gallery images + captions.
// ---------------------------------------------------------------------------

export type GallerySeed = {
  title: Bilingual;
  imageUrl: string;
  category?: string;
  order: number;
  isActive: boolean;
};

// Complete the English branch content for the bilingual storefront.
branchesSeed[0]!.name.en = "Sabah Al Salem Branch";
branchesSeed[0]!.address.en = "Sabah Al Salem, Orange Tower, opposite Oxygen Club";
branchesSeed[1]!.name.en = "Al Riqqa Branch";
branchesSeed[1]!.address.en = "Al Riqqa, Fourth Ring Road, next to Oxygen Club";

export const gallerySeed: GallerySeed[] = [];

// ---------------------------------------------------------------------------
// FAQ — auto-generated IDs
// TODO: the FAQ sheet only had the template's example row. Populate
// this array once the client sends their real Q&A list.
// ---------------------------------------------------------------------------

export type FaqSeed = {
  question: Bilingual;
  answer: Bilingual;
  category?: string;
  order: number;
  isActive: boolean;
};

export const faqSeed: FaqSeed[] = [];

// ---------------------------------------------------------------------------
// TESTIMONIALS — auto-generated IDs
// TODO: no Testimonials sheet was included in the content collection
// form at all. Populate this array once the client sends reviews they
// want featured.
// ---------------------------------------------------------------------------

export type TestimonialSeed = {
  clientName: string;
  content: Bilingual;
  rating: number;
  avatarUrl: string | null;
  order: number;
  isActive: boolean;
};

export const testimonialsSeed: TestimonialSeed[] = [
  {
    clientName: "Muhamd Aladwany",
    content: {
      en: "المكان نظيف العماله ذو خبره جيده و احترام مناسب للاشخاص الي يبحثون عن الراحه في الاماكن النظيفه و المحترمه\nرعايه و اهتمام و خدمات مساج متنوعه\nو حتى الظيافه مهتمين فيها مكان يستاهل التجربه",
      ar: "المكان نظيف العماله ذو خبره جيده و احترام مناسب للاشخاص الي يبحثون عن الراحه في الاماكن النظيفه و المحترمه\nرعايه و اهتمام و خدمات مساج متنوعه\nو حتى الظيافه مهتمين فيها مكان يستاهل التجربه",
    },
    rating: 5,
    avatarUrl: null,
    order: 0,
    isActive: true,
  },
  {
    clientName: "Only Sef",
    content: {
      en: "في اكثر كن خمس نجوم ؟ بالضبط هذا الشغل الصح بعمري ماجصلت مساج بالكويت نفس مستوى هذا المعهد\nومشكور ثامر على حسن الضيافه والاستقبال بالدخول والخروج ❤️",
      ar: "في اكثر كن خمس نجوم ؟ بالضبط هذا الشغل الصح بعمري ماجصلت مساج بالكويت نفس مستوى هذا المعهد\nومشكور ثامر على حسن الضيافه والاستقبال بالدخول والخروج ❤️",
    },
    rating: 5,
    avatarUrl: null,
    order: 1,
    isActive: true,
  },
  {
    clientName: "Yousef Talal",
    content: {
      en: "كا الشكر حق موظف الاستقبال محمد و العامل روزي\nتجربة رائعة وخدمة ولا اروح والسعر مقابل الخدمة يستحق\nلا يوجد اي ملاحظات او سلبيات وجدتها في هذا المكان الرائع",
      ar: "كا الشكر حق موظف الاستقبال محمد و العامل روزي\nتجربة رائعة وخدمة ولا اروح والسعر مقابل الخدمة يستحق\nلا يوجد اي ملاحظات او سلبيات وجدتها في هذا المكان الرائع",
    },
    rating: 5,
    avatarUrl: null,
    order: 2,
    isActive: true,
  },
];
