"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/auth/session";
import { REVALIDATE_TAGS } from "@/lib/constants";
import { actionErrorMessage, type ActionResult } from "@/lib/actions/types";
import { branchFormSchema, type BranchFormValues } from "./schema";

const COLLECTION = "branches";

export async function createBranch(
  values: BranchFormValues,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    const data = branchFormSchema.parse(values);
    const docRef = adminDb.collection(COLLECTION).doc();
    await docRef.set({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidateTag(REVALIDATE_TAGS.branches);
    return { success: true, data: { id: docRef.id } };
  } catch (error) {
    console.error("createBranch failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to create branch.") };
  }
}

export async function updateBranch(id: string, values: BranchFormValues): Promise<ActionResult> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    const data = branchFormSchema.parse(values);
    await adminDb.collection(COLLECTION).doc(id).update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidateTag(REVALIDATE_TAGS.branches);
    return { success: true };
  } catch (error) {
    console.error("updateBranch failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to update branch.") };
  }
}

export async function deleteBranch(id: string): Promise<ActionResult> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    await adminDb.collection(COLLECTION).doc(id).delete();
    revalidateTag(REVALIDATE_TAGS.branches);
    return { success: true };
  } catch (error) {
    console.error("deleteBranch failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to delete branch.") };
  }
}

export async function toggleBranchActive(id: string, isActive: boolean): Promise<ActionResult> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    await adminDb.collection(COLLECTION).doc(id).update({
      isActive,
      updatedAt: FieldValue.serverTimestamp(),
    });
    revalidateTag(REVALIDATE_TAGS.branches);
    return { success: true };
  } catch (error) {
    console.error("toggleBranchActive failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to update branch.") };
  }
}
