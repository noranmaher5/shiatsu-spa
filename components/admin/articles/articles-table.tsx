"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Newspaper } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ADMIN_ROUTES } from "@/lib/constants";
import { deleteArticle, toggleArticleActive } from "@/features/articles/actions";
import type { Article } from "@/features/articles/types";

function formatDate(dateStr: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export function ArticlesTable({ articles }: { articles: Article[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  function handleToggle(article: Article, next: boolean) {
    setPendingToggleId(article.id);
    startTransition(async () => {
      const result = await toggleArticleActive(article.id, next);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success(next ? "Article published." : "Article unpublished.");
        router.refresh();
      }
      setPendingToggleId(null);
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteArticle(deleteTarget.id, deleteTarget.slug);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success("Article deleted.");
        router.refresh();
      }
      setDeleteTarget(null);
    });
  }

  if (articles.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground shadow-xs">
        <Newspaper className="mx-auto size-8 text-muted-foreground/50 mb-3" />
        No articles yet. Create your first article to boost SEO.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="border-b border-border/80 hover:bg-transparent">
            <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">Title</TableHead>
            <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">Slug</TableHead>
            <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">Published</TableHead>
            <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wider">Status</TableHead>
            <TableHead className="text-end font-semibold text-foreground text-xs uppercase tracking-wider">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id} className="transition-colors hover:bg-muted/30">
              <TableCell className="font-medium text-foreground py-4">
                <span className="font-semibold text-sm text-foreground">{article.title.en}</span>
              </TableCell>
              <TableCell>
                <code className="text-muted-foreground rounded bg-muted/60 px-2 py-1 text-xs">
                  {article.slug}
                </code>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(article.publishedAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={article.isActive}
                    onCheckedChange={(next) => handleToggle(article, next)}
                    disabled={isPending && pendingToggleId === article.id}
                    aria-label={`Toggle ${article.title.en} active`}
                  />
                  <span className={`text-xs font-medium ${article.isActive ? "text-emerald-700 font-semibold" : "text-muted-foreground"}`}>
                    {article.isActive ? "Published" : "Draft"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1.5">
                  <Button variant="ghost" size="icon" asChild className="size-8 rounded-lg hover:bg-[#143725]/10 hover:text-[#143725]">
                    <Link href={ADMIN_ROUTES.editArticle(article.id)} aria-label="Edit">
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(article)}
                    aria-label="Delete"
                    className="size-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete article?"
        description={`"${deleteTarget?.title.en}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        isLoading={isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
