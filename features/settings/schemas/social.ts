import { z } from "zod";

const optionalUrl = z.preprocess(
  (value) => {
    if (value == null) return null;
    if (typeof value !== "string") return value;

    const valueWithProtocol = value.trim();
    if (valueWithProtocol === "") return null;

    // Admins commonly paste `instagram.com/...` without the protocol.
    const normalized = /^https?:\/\//i.test(valueWithProtocol)
      ? valueWithProtocol
      : `https://${valueWithProtocol}`;

    // Instagram share links may contain an expired/invalid `igsh` tracking
    // token. The canonical profile/post URL works without that query string.
    try {
      const url = new URL(normalized);
      if (url.hostname.toLowerCase().endsWith("instagram.com")) {
        url.searchParams.delete("igsh");
        return url.toString();
      }
    } catch {
      // Let zod return the normal URL validation message below.
    }

    return normalized;
  },
  z.union([z.string().url("Enter a valid URL"), z.null()]),
);

export const socialSettingsSchema = z.object({
  instagram: optionalUrl,
  snapchat: optionalUrl,
  tiktok: optionalUrl,
  twitter: optionalUrl,
  facebook: optionalUrl,
  website: optionalUrl,
});

export type SocialSettingsFormValues = z.input<typeof socialSettingsSchema>;
export type SocialSettingsFormData = z.output<typeof socialSettingsSchema>;
