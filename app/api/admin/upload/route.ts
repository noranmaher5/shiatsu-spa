import { createHash, randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB server fallback limit
const ALLOWED_FOLDERS = ["settings", "branches", "categories", "services", "gallery"] as const;
type AllowedFolder = (typeof ALLOWED_FOLDERS)[number];

function isAllowedFolder(value: string): value is AllowedFolder {
  return (ALLOWED_FOLDERS as readonly string[]).includes(value);
}

/**
 * Handles image uploads for every admin form (branch cover photos,
 * service images, gallery items, testimonial avatars, settings
 * logo/hero/OG images). A Route Handler rather than a Server Action —
 * Server Actions have a much lower default body-size limit, which is
 * awkward for multi-MB image uploads.
 *
 * Images are uploaded to Cloudinary and the returned secure URL is saved in
 * Firestore by the calling form. The route stays protected by the admin
 * session, while Cloudinary credentials remain server-only.
 */
export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = formData.get("folder");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (typeof folder !== "string" || !isAllowedFolder(folder)) {
    return NextResponse.json({ error: "Invalid upload folder." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Image file is too large (max 20MB)." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary upload is not configured." },
        { status: 500 },
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_").replace(/\.[^.]+$/, "");
    const publicId = `${folder}/${randomUUID()}-${safeName}`;
    const signatureBase = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}`;
    const signature = createHash("sha1")
      .update(`${signatureBase}${apiSecret}`)
      .digest("hex");

    const uploadData = new FormData();
    uploadData.append("file", new Blob([buffer], { type: file.type }), file.name);
    uploadData.append("api_key", apiKey);
    uploadData.append("timestamp", String(timestamp));
    uploadData.append("folder", folder);
    uploadData.append("public_id", publicId);
    uploadData.append("signature", signature);

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadData,
      },
    );
    const result = (await cloudinaryResponse.json()) as {
      secure_url?: string;
      error?: { message?: string };
    };

    if (!cloudinaryResponse.ok || !result.secure_url) {
      throw new Error(result.error?.message || "Cloudinary rejected the upload.");
    }

    return NextResponse.json({ url: result.secure_url, path: publicId });
  } catch (error) {
    console.error("Image upload failed:", error);
    const code = error instanceof Error ? error.message : "Unknown storage error";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `Upload failed: ${code}`
            : "Upload failed. Please check Cloudinary configuration.",
      },
      { status: 500 },
    );
  }
}
