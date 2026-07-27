"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, X, UploadCloud, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImageUploaderProps = {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: "settings" | "branches" | "categories" | "services" | "gallery";
  label?: string;
  className?: string;
  aspectClassName?: string;
};

/**
 * Resizes and compresses high-resolution images in the browser before upload.
 * Downscales images over 2048px and converts to optimized WebP format.
 */
async function compressImage(file: File, maxDimension = 2048, quality = 0.85): Promise<File> {
  // If image is already small (<= 400KB), return as is
  if (file.size <= 400 * 1024 && (file.type === "image/webp" || file.type === "image/jpeg")) {
    return file;
  }

  return new Promise((resolve) => {
    const img = document.createElement("img");
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const safeName = file.name.replace(/\.[^.]+$/, "") + ".webp";
          const compressedFile = new File([blob], safeName, { type: "image/webp" });
          resolve(compressedFile.size < file.size ? compressedFile : file);
        },
        "image/webp",
        quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}

export function ImageUploader({
  value,
  onChange,
  folder,
  label = "Image",
  className,
  aspectClassName = "aspect-video max-h-56",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file.");
      return;
    }

    setIsUploading(true);
    try {
      // Compress image client-side before sending to server
      const fileToUpload = await compressImage(file);

      // Check compressed file size (should virtually always be < 2MB)
      if (fileToUpload.size > 20 * 1024 * 1024) {
        toast.error("Image is too large to process.");
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("folder", folder);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      onChange(data.url);
      toast.success("Image uploaded successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-xs font-semibold text-foreground uppercase tracking-wider">{label}</span>

      <div
        className={cn(
          "group relative w-full overflow-hidden rounded-2xl border-2 border-dashed border-border/90 bg-muted/20 transition-all hover:border-[#143725]/50 hover:bg-[#143725]/5",
          aspectClassName,
        )}
      >
        {value ? (
          <>
            <Image src={value} alt="" fill sizes="400px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
                className="rounded-xl bg-white/90 text-black hover:bg-white"
              >
                {isUploading ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
                Replace
              </Button>
              <button
                type="button"
                onClick={() => onChange(null)}
                className="rounded-xl bg-red-600/90 p-2 text-white transition-colors hover:bg-red-600"
                aria-label="Remove image"
              >
                <X className="size-4" />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="flex size-full flex-col items-center justify-center gap-2.5 p-5 text-center text-xs font-medium transition-colors"
          >
            <div className="flex size-11 items-center justify-center rounded-2xl bg-muted/60 text-[#143725] transition-transform duration-200 group-hover:scale-110 group-hover:bg-[#143725] group-hover:text-white">
              {isUploading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <UploadCloud className="size-5" />
              )}
            </div>
            <div>
              <span className="font-semibold text-foreground block text-sm">
                {isUploading ? "Compressing & Uploading..." : "Click or drag image to upload"}
              </span>
              <span className="text-muted-foreground text-[11px]">Auto-optimizes high-resolution photos (PNG, JPG, WebP)</span>
            </div>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
