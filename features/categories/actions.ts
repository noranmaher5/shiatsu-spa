"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/auth/session";
import { REVALIDATE_TAGS } from "@/lib/constants";
import { actionErrorMessage, type ActionResult } from "@/lib/actions/types";
import { categoryFormSchema, type CategoryFormValues } from "./schema";

const COLLECTION = "categories";

export async function createCategory(
  values: CategoryFormValues,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    const data = categoryFormSchema.parse(values);
    const docRef = adminDb.collection(COLLECTION).doc();
    await docRef.set({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidateTag(REVALIDATE_TAGS.categories);
    return { success: true, data: { id: docRef.id } };
  } catch (error) {
    console.error("createCategory failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to create category.") };
  }
}

export async function updateCategory(
  id: string,
  values: CategoryFormValues,
): Promise<ActionResult> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    const data = categoryFormSchema.parse(values);
    await adminDb.collection(COLLECTION).doc(id).update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidateTag(REVALIDATE_TAGS.categories);
    // A category rename/reorder can change how services group/display.
    revalidateTag(REVALIDATE_TAGS.services);
    return { success: true };
  } catch (error) {
    console.error("updateCategory failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to update category.") };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    const servicesInCategory = await adminDb
      .collection("services")
      .where("categoryId", "==", id)
      .limit(1)
      .get();

    if (!servicesInCategory.empty) {
      return {
        success: false,
        error: "Cannot delete a category that still has services assigned to it.",
      };
    }

    await adminDb.collection(COLLECTION).doc(id).delete();
    revalidateTag(REVALIDATE_TAGS.categories);
    return { success: true };
  } catch (error) {
    console.error("deleteCategory failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to delete category.") };
  }
}

export async function toggleCategoryActive(id: string, isActive: boolean): Promise<ActionResult> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    await adminDb.collection(COLLECTION).doc(id).update({
      isActive,
      updatedAt: FieldValue.serverTimestamp(),
    });
    revalidateTag(REVALIDATE_TAGS.categories);
    return { success: true };
  } catch (error) {
    console.error("toggleCategoryActive failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to update category.") };
  }
}
