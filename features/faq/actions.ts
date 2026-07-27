"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/auth/session";
import { REVALIDATE_TAGS } from "@/lib/constants";
import { actionErrorMessage, type ActionResult } from "@/lib/actions/types";
import { faqFormSchema, type FaqFormValues } from "./schema";

const COLLECTION = "faq";

export async function createFaq(values: FaqFormValues): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    const data = faqFormSchema.parse(values);
    const docRef = adminDb.collection(COLLECTION).doc();
    await docRef.set({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidateTag(REVALIDATE_TAGS.faq);
    return { success: true, data: { id: docRef.id } };
  } catch (error) {
    console.error("createFaq failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to create FAQ.") };
  }
}

export async function updateFaq(id: string, values: FaqFormValues): Promise<ActionResult> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    const data = faqFormSchema.parse(values);
    await adminDb.collection(COLLECTION).doc(id).update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidateTag(REVALIDATE_TAGS.faq);
    return { success: true };
  } catch (error) {
    console.error("updateFaq failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to update FAQ.") };
  }
}

export async function deleteFaq(id: string): Promise<ActionResult> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    await adminDb.collection(COLLECTION).doc(id).delete();
    revalidateTag(REVALIDATE_TAGS.faq);
    return { success: true };
  } catch (error) {
    console.error("deleteFaq failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to delete FAQ.") };
  }
}

export async function toggleFaqActive(id: string, isActive: boolean): Promise<ActionResult> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    await adminDb.collection(COLLECTION).doc(id).update({
      isActive,
      updatedAt: FieldValue.serverTimestamp(),
    });
    revalidateTag(REVALIDATE_TAGS.faq);
    return { success: true };
  } catch (error) {
    console.error("toggleFaqActive failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to update FAQ.") };
  }
}
