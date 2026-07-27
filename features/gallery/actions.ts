"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/auth/session";
import { REVALIDATE_TAGS } from "@/lib/constants";
import { actionErrorMessage, type ActionResult } from "@/lib/actions/types";
import { galleryFormSchema, type GalleryFormValues } from "./schema";

const COLLECTION = "gallery";

export async function createGalleryItem(
  values: GalleryFormValues,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    const data = galleryFormSchema.parse(values);
    const docRef = adminDb.collection(COLLECTION).doc();
    await docRef.set({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidateTag(REVALIDATE_TAGS.gallery);
    return { success: true, data: { id: docRef.id } };
  } catch (error) {
    console.error("createGalleryItem failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to create gallery item.") };
  }
}

export async function updateGalleryItem(
  id: string,
  values: GalleryFormValues,
): Promise<ActionResult> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    const data = galleryFormSchema.parse(values);
    await adminDb.collection(COLLECTION).doc(id).update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidateTag(REVALIDATE_TAGS.gallery);
    return { success: true };
  } catch (error) {
    console.error("updateGalleryItem failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to update gallery item.") };
  }
}

export async function deleteGalleryItem(id: string): Promise<ActionResult> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    await adminDb.collection(COLLECTION).doc(id).delete();
    revalidateTag(REVALIDATE_TAGS.gallery);
    return { success: true };
  } catch (error) {
    console.error("deleteGalleryItem failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to delete gallery item.") };
  }
}

export async function toggleGalleryItemActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    await adminDb.collection(COLLECTION).doc(id).update({
      isActive,
      updatedAt: FieldValue.serverTimestamp(),
    });
    revalidateTag(REVALIDATE_TAGS.gallery);
    return { success: true };
  } catch (error) {
    console.error("toggleGalleryItemActive failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to update gallery item.") };
  }
}
