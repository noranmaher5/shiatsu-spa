import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettierConfig from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * eslint-config-next@15 ships its rules in the legacy `.eslintrc`
 * format (no flat-config "exports" map yet — that only landed in
 * later major versions). FlatCompat is the official bridge Next.js's
 * own tooling uses to load a classic shareable config ("next/core-web-vitals")
 * into ESLint's flat config system, which this project uses everywhere else.
 */
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Must come LAST — turns off any stylistic ESLint rules that would
  // otherwise conflict with Prettier's formatting decisions. Prettier
  // owns formatting; ESLint owns code quality/correctness.
  prettierConfig,
  {
    rules: {
      // Catches leftover console.log statements before they ship —
      // console.warn/error are still allowed for real error reporting.
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // `any` defeats the entire point of "always use TypeScript" —
      // this is an error, not a warning, on this project.
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts", "node_modules/**"],
  },
];

export default eslintConfig;
