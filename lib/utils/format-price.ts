/**
 * Formats a numeric price into the client-confirmed display format:
 * "15 KWD" (English) or "15 د.ك" (Arabic — matches the `common.currency`
 * translation key). Prices are always stored as numbers in Firestore —
 * this is the ONLY place that turns a number into the display string,
 * so a future currency or format change only touches one function.
 */
export function formatPrice(price: number, locale: "en" | "ar" = "en"): string {
  if (!Number.isFinite(price) || price < 0) {
    throw new Error(`formatPrice received an invalid price: ${price}`);
  }

  // Keep whole numbers clean ("15 KWD") but preserve up to 3 decimals
  // (KWD is commonly quoted to 3 decimal places) when present.
  const rounded = Math.round(price * 1000) / 1000;
  const formatted = Number.isInteger(rounded)
    ? rounded.toString()
    : rounded.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");

  const currency = locale === "ar" ? "د.ك" : "KWD";

  return `${formatted} ${currency}`;
}
