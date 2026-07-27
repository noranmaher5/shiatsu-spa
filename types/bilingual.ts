/**
 * Every bilingual field in Firestore (service names, descriptions,
 * FAQ questions/answers, etc.) uses this exact shape. Defined once
 * here so `Bilingual` is the single type every feature imports —
 * never redefine `{ en: string; ar: string }` inline in a feature file.
 */
export type Bilingual = {
  en: string;
  ar: string;
};

/** Same shape, but explicitly optional — for nullable fields like a
 * service's shortDescription, which the Excel import may leave empty. */
export type OptionalBilingual = {
  en?: string;
  ar?: string;
} | null;
