"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/auth/session";
import { REVALIDATE_TAGS } from "@/lib/constants";
import { actionErrorMessage, type ActionResult } from "@/lib/actions/types";
import { serviceFormSchema, type ServiceFormValues } from "./schema";

const COLLECTION = "services";

export async function createService(
  values: ServiceFormValues,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    const data = serviceFormSchema.parse(values);

    const docRef = adminDb.collection(COLLECTION).doc();
    await docRef.set({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidateTag(REVALIDATE_TAGS.services);
    revalidateTag(REVALIDATE_TAGS.serviceDetail(data.slug));

    return { success: true, data: { id: docRef.id } };
  } catch (error) {
    console.error("createService failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to create service.") };
  }
}

export async function updateService(
  id: string,
  values: ServiceFormValues,
  previousSlug?: string,
): Promise<ActionResult> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    const data = serviceFormSchema.parse(values);

    await adminDb.collection(COLLECTION).doc(id).update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidateTag(REVALIDATE_TAGS.services);
    revalidateTag(REVALIDATE_TAGS.serviceDetail(data.slug));
    if (previousSlug && previousSlug !== data.slug) {
      revalidateTag(REVALIDATE_TAGS.serviceDetail(previousSlug));
    }

    return { success: true };
  } catch (error) {
    console.error("updateService failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to update service.") };
  }
}

export async function deleteService(id: string, slug: string): Promise<ActionResult> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    await adminDb.collection(COLLECTION).doc(id).delete();

    revalidateTag(REVALIDATE_TAGS.services);
    revalidateTag(REVALIDATE_TAGS.serviceDetail(slug));

    return { success: true };
  } catch (error) {
    console.error("deleteService failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to delete service.") };
  }
}

export async function toggleServiceActive(id: string, isActive: boolean): Promise<ActionResult> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    await adminDb.collection(COLLECTION).doc(id).update({
      isActive,
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidateTag(REVALIDATE_TAGS.services);

    return { success: true };
  } catch (error) {
    console.error("toggleServiceActive failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to update service.") };
  }
}
