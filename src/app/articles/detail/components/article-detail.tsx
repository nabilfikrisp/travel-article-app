import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatISODate } from "@/lib/format-iso-date";
import ArticleComments from "./article-comments";
import { useAppSelector } from "@/store/hooks";

type ArticleDetailProps = {
  documentId: string;
};

export default function ArticleDetail({ documentId }: ArticleDetailProps) {
  const datum = useAppSelector((state) => state.article.detail.datum[documentId]);

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
      <p className="mb-5">{datum.description}</p>
      <Separator className="my-5 bg-primary" />
      <h2 className="mb-5 text-2xl font-bold">Comments</h2>
      {datum.comments && datum.comments?.length > 0 ? (
        <>
          <ArticleComments
            documentIds={datum.comments.map((comment) => comment.documentId)}
            articleDocumentId={documentId}
          />
        </>
      ) : (
        <div>No comment :(</div>
      )}
    </div>
  );
}
