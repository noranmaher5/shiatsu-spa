import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";

loadEnv({ path: resolve(process.cwd(), ".env.local") });

// The Admin SDK reads environment variables during module initialization.
// Load dotenv first, then require it so the credentials are available.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { adminAuth } = require("./lib/admin") as typeof import("./lib/admin");

const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;

if (!email || !password) {
  throw new Error(
    "Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD before running `npm run seed:admin`.",
  );
}

const adminEmail = email;
const adminPassword = password;

async function main() {
  let user;

  try {
    user = await adminAuth.getUserByEmail(adminEmail);
    user = await adminAuth.updateUser(user.uid, { password: adminPassword });
    console.log(`Admin account updated: ${user.email}`);
  } catch (error) {
    if ((error as { code?: string }).code !== "auth/user-not-found") throw error;

    user = await adminAuth.createUser({ email: adminEmail, password: adminPassword });
    console.log(`Admin account created: ${user.email}`);
  }

  await adminAuth.setCustomUserClaims(user.uid, { role: "admin" });
  console.log("Admin role assigned.");
}

main().catch((error) => {
  console.error("Admin seed failed:", error);
  process.exitCode = 1;
});
