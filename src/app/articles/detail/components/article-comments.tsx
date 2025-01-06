import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDetailedComments } from "@/store/slices/comment/commentSlice";
import { useEffect, useState } from "react";
import ArticleCommentLoading from "./article-comment-loading";
import { formatISODate } from "@/lib/format-iso-date";

type ArticleCommentsType = {
  commentDocumentIds: string[];
  articleDocumentId: string;
};

export default function ArticleComments({
  articleDocumentId,
  commentDocumentIds,
}: ArticleCommentsType) {
  const dispatch = useAppDispatch();
  const articleComments = useAppSelector(
    (state) => state.comment.articleComments[articleDocumentId]
  );
  const [offset, setOffset] = useState(0);
  const limit = 5;

  useEffect(() => {
    if (articleComments) {
      setOffset(articleComments.data.length);
      return;
    }

    dispatch(
      fetchDetailedComments({
        arrayOfDocumentIds: commentDocumentIds.slice(0, limit),
        articleDocumentId,
      })
    );
  }, [dispatch, articleDocumentId, commentDocumentIds, articleComments]);

  const handleLoadMore = () => {
    dispatch(
      fetchDetailedComments({
        arrayOfDocumentIds: commentDocumentIds.slice(offset, offset + limit),
        articleDocumentId,
        isLoadMore: true,
      })
    );
  };

  if (!articleComments) return <ArticleCommentLoading />;
  if (articleComments.status === "loading" && offset === 0) return <ArticleCommentLoading />;
  if (articleComments.status === "failed") return <p>Error: {articleComments.error}</p>;

  const renderButtonCondition = articleComments.data.length !== commentDocumentIds.length;

  return (
    <>
      <ul className="mb-5 flex flex-col gap-4">
        {articleComments.data.map((comment, index) => (
          <div className="overflow-hidden rounded-lg border border-foreground p-4" key={index}>
            <div className="mb-2 flex items-center gap-2">
              <span className="font-semibold">{comment.user.username}</span>
              <span className="text-sm">{formatISODate(comment.publishedAt)}</span>
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
      </ul>
      {renderButtonCondition && (
        <Button
          onClick={() => handleLoadMore()}
          isLoading={articleComments.status === "loading"}
          className="w-full"
        >
          Load More
        </Button>
      )}
    </>
  );
}
