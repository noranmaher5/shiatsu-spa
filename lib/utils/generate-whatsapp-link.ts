type GenerateWhatsappLinkParams = {
  /** WhatsApp number in international format, digits only, e.g. "96550890601" */
  phoneNumber: string;
  /** Name of the service the visitor wants to book */
  serviceName: string;
  /** Optional branch name, appended to the message if provided */
  branchName?: string;
  /** Locale the pre-filled message should be written in. Defaults to
   * "en" for any caller that hasn't been updated to pass the current
   * locale yet. */
  locale?: "en" | "ar";
};

/**
 * Builds a wa.me deep link with a pre-filled, URL-encoded message.
 * This is the ONLY booking mechanism in the app (no calendar, no
 * payment gateway, no CRM) — every "Book Now" button in the codebase
 * must go through this function so the message format stays
 * consistent across the whole site. The message itself is written in
 * the visitor's current locale rather than always in English.
 */
export function generateWhatsappLink({
  phoneNumber,
  serviceName,
  branchName,
  locale = "en",
}: GenerateWhatsappLinkParams): string {
  const sanitizedNumber = phoneNumber.replace(/[^\d]/g, "");

  const message =
    locale === "ar"
      ? branchName
        ? `مرحبًا، أرغب في حجز "${serviceName}" في فرع ${branchName}.`
        : `مرحبًا، أرغب في حجز "${serviceName}".`
      : branchName
        ? `Hello, I would like to book "${serviceName}" at your ${branchName} branch.`
        : `Hello, I would like to book "${serviceName}".`;

  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${sanitizedNumber}?text=${encodedMessage}`;
}
