"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/auth/session";
import { REVALIDATE_TAGS } from "@/lib/constants";
import { actionErrorMessage, type ActionResult } from "@/lib/actions/types";
import { testimonialFormSchema, type TestimonialFormValues } from "./schema";

const COLLECTION = "testimonials";

export async function createTestimonial(
  values: TestimonialFormValues,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    const data = testimonialFormSchema.parse(values);
    const docRef = adminDb.collection(COLLECTION).doc();
    await docRef.set({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidateTag(REVALIDATE_TAGS.testimonials);
    return { success: true, data: { id: docRef.id } };
  } catch (error) {
    console.error("createTestimonial failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to create testimonial.") };
  }
}

export async function updateTestimonial(
  id: string,
  values: TestimonialFormValues,
): Promise<ActionResult> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    const data = testimonialFormSchema.parse(values);
    await adminDb.collection(COLLECTION).doc(id).update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidateTag(REVALIDATE_TAGS.testimonials);
    return { success: true };
  } catch (error) {
    console.error("updateTestimonial failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to update testimonial.") };
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    await adminDb.collection(COLLECTION).doc(id).delete();
    revalidateTag(REVALIDATE_TAGS.testimonials);
    return { success: true };
  } catch (error) {
    console.error("deleteTestimonial failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to delete testimonial.") };
  }
}

export async function toggleTestimonialActive(
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
    revalidateTag(REVALIDATE_TAGS.testimonials);
    return { success: true };
  } catch (error) {
    console.error("toggleTestimonialActive failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to update testimonial.") };
  }
}
