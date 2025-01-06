import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatISODate } from "@/lib/format-iso-date";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchArticleByDocumentId } from "@/store/slices/article/articleSlice";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router";
import ArticleComments from "./components/article-comments";

export function ArticleDetailPage() {
  const { documentId } = useParams();
  const dispatch = useAppDispatch();
  const { status, error, datum } = useAppSelector((state) => state.article.detail);

  useEffect(() => {
    if (!documentId) {
      return;
    }

    dispatch(fetchArticleByDocumentId(documentId));
  }, [dispatch, documentId]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;
  if (!documentId) return <Navigate to="/articles" />;
  if (!datum) return <div>Article Not Found</div>;

  return (
    <div className="py-10">
      <h1 className="mb-5 text-3xl font-bold">{datum.title}</h1>

      {datum.cover_image_url ? (
        <img
          src={datum.cover_image_url}
          alt={datum.title}
          loading="lazy"
          className="mb-5 aspect-video max-h-[500px] w-full rounded-lg object-cover"
        />
      ) : (
        <Skeleton className="mb-5 aspect-video max-h-[500px] w-full rounded-lg" />
      )}

      <div className="mb-5 flex flex-wrap gap-2">
        <div>
          Author:
          <span className="ml-1 font-bold">{datum.user?.username || "-"}</span>
        </div>
        <Separator orientation="vertical" />
        <div>
          Published:
          <span className="ml-1 font-bold">{formatISODate(datum.publishedAt)}</span>
        </div>
        <Separator orientation="vertical" />
        <div>
          Category:
          {datum.category ? (
            <span className="ml-1 font-bold">
              <Badge>{datum.category.name}</Badge>
            </span>
          ) : (
            <span className="ml-1">-</span>
          )}
        </div>
      </div>

      <p className="mb">{datum.description}</p>
      <Separator className="my-5 bg-primary" />
      <h2 className="mb-5 text-2xl font-bold">Comments</h2>
      {datum.comments && datum.comments?.length > 0 ? (
        <>
          <div>TOTAL COMMENT{datum.comments.length}</div>
          <ArticleComments
            documentIds={datum.comments.map((comment) => comment.documentId)}
            articleDocumentId={documentId}
          />
        </>
      ) : (
        <>no comment</>
      )}
    </div>
  );
}
