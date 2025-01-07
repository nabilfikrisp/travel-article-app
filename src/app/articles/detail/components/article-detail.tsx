import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatISODate } from "@/lib/format-iso-date";
import { useAppSelector } from "@/store/hooks";
import ArticleCreateCommentForm from "./article-create-comment-form";
import ArticleCommentsV2 from "./article-comments-v2";
import { Button } from "@/components/ui/button";
import { FilePenLineIcon } from "lucide-react";
import { Link } from "react-router";
import DeleteArticleButton from "./delete-article-button";

type ArticleDetailProps = {
  documentId: string;
};

export default function ArticleDetail({ documentId }: ArticleDetailProps) {
  const datum = useAppSelector((state) => state.article.detail.datum[documentId]);
  const { user } = useAppSelector((state) => state.auth);

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
        <div className="mb-5 aspect-video max-h-[500px] w-full rounded-lg bg-gray-400"></div>
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
        {user?.documentId === datum.user?.documentId && (
          <div className="ml-auto flex items-center gap-2">
            <Button asChild>
              <Link to={`/articles/${datum.documentId}/edit`}>
                Edit
                <FilePenLineIcon className="ml-1" />
              </Link>
            </Button>
            <DeleteArticleButton articleDocumentId={datum.documentId} />
          </div>
        )}
      </div>
      <p className="mb-5">{datum.description}</p>
      <Separator className="my-5 bg-primary" />
      <h2 className="mb-5 text-2xl font-bold">Comments</h2>
      <ArticleCreateCommentForm articleDocumentId={documentId} articleId={datum.id} />
      {datum.comments && datum.comments?.length > 0 ? (
        <ArticleCommentsV2 articleDocumentId={datum.documentId} comments={datum.comments} />
      ) : (
        <div>No comment :(</div>
      )}
    </div>
  );
}
