"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/auth/session";
import { REVALIDATE_TAGS } from "@/lib/constants";
import { actionErrorMessage, type ActionResult } from "@/lib/actions/types";
import { articleFormSchema, type ArticleFormValues } from "./schema";

const COLLECTION = "articles";

export async function createArticle(
  values: ArticleFormValues,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    const data = articleFormSchema.parse(values);

    const docRef = adminDb.collection(COLLECTION).doc();
    await docRef.set({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidateTag(REVALIDATE_TAGS.articles);
    revalidateTag(REVALIDATE_TAGS.articleDetail(data.slug));

    return { success: true, data: { id: docRef.id } };
  } catch (error) {
    console.error("createArticle failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to create article.") };
  }
}

export async function updateArticle(
  id: string,
  values: ArticleFormValues,
  previousSlug?: string,
): Promise<ActionResult> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    const data = articleFormSchema.parse(values);

    await adminDb.collection(COLLECTION).doc(id).update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidateTag(REVALIDATE_TAGS.articles);
    revalidateTag(REVALIDATE_TAGS.articleDetail(data.slug));
    if (previousSlug && previousSlug !== data.slug) {
      revalidateTag(REVALIDATE_TAGS.articleDetail(previousSlug));
    }

    return { success: true };
  } catch (error) {
    console.error("updateArticle failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to update article.") };
  }
}

export async function deleteArticle(id: string, slug: string): Promise<ActionResult> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    await adminDb.collection(COLLECTION).doc(id).delete();

    revalidateTag(REVALIDATE_TAGS.articles);
    revalidateTag(REVALIDATE_TAGS.articleDetail(slug));

    return { success: true };
  } catch (error) {
    console.error("deleteArticle failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to delete article.") };
  }
}

export async function toggleArticleActive(id: string, isActive: boolean): Promise<ActionResult> {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, error: "Not authenticated." };

    await adminDb.collection(COLLECTION).doc(id).update({
      isActive,
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidateTag(REVALIDATE_TAGS.articles);

    return { success: true };
  } catch (error) {
    console.error("toggleArticleActive failed:", error);
    return { success: false, error: actionErrorMessage(error, "Failed to update article.") };
  }
}
