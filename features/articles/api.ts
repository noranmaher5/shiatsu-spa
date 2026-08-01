import { unstable_cache } from "next/cache";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createConverter, timestampToIso } from "@/lib/firebase/firestore-helpers";
import { REVALIDATE_TAGS, DEFAULT_REVALIDATE_SECONDS } from "@/lib/constants";
import type { Article } from "./types";

type ArticleDoc = Omit<Article, "id" | "createdAt" | "updatedAt"> & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

const articleConverter = createConverter<ArticleDoc>();

function mapArticleDoc(docSnapshot: { id: string; data: () => ArticleDoc }): Article {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    ...data,
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
  } satisfies Article;
}

function sortByPublishedAt(articles: Article[]): Article[] {
  return articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

async function fetchActiveArticles(): Promise<Article[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "articles").withConverter(articleConverter),
        where("isActive", "==", true),
      ),
    );
    return sortByPublishedAt(snapshot.docs.map(mapArticleDoc));
  } catch (error) {
    console.error("Error fetching active articles:", error);
    return [];
  }
}

async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "articles").withConverter(articleConverter),
        where("slug", "==", slug),
        where("isActive", "==", true),
      ),
    );
    const match = snapshot.docs[0];
    return match ? mapArticleDoc(match) : null;
  } catch (error) {
    console.error(`Error fetching article by slug ${slug}:`, error);
    return null;
  }
}

export const getActiveArticles = unstable_cache(
  fetchActiveArticles,
  ["articles-active"],
  {
    tags: [REVALIDATE_TAGS.articles],
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  },
);

export const getArticleBySlug = (slug: string) =>
  unstable_cache(
    () => fetchArticleBySlug(slug),
    [`article-detail-${slug}`],
    {
      tags: [REVALIDATE_TAGS.articleDetail(slug), REVALIDATE_TAGS.articles],
      revalidate: DEFAULT_REVALIDATE_SECONDS,
    },
  )();

async function fetchAllArticlesAdmin(): Promise<Article[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "articles").withConverter(articleConverter),
        orderBy("order", "asc"),
      ),
    );
    return snapshot.docs.map(mapArticleDoc);
  } catch (error) {
    console.error("Error fetching all articles (admin):", error);
    return [];
  }
}

export const getAllArticlesAdmin = unstable_cache(fetchAllArticlesAdmin, ["articles-admin-all"], {
  tags: [REVALIDATE_TAGS.articles],
  revalidate: DEFAULT_REVALIDATE_SECONDS,
});

export async function getArticleByIdAdmin(id: string): Promise<Article | null> {
  try {
    const snapshot = await getDoc(doc(db, "articles", id).withConverter(articleConverter));
    if (!snapshot.exists()) return null;
    return mapArticleDoc(snapshot);
  } catch (error) {
    console.error(`Error fetching article ${id} (admin):`, error);
    return null;
  }
}
