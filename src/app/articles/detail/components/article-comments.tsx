import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDetailedComments } from "@/store/slices/comment/commentSlice";
import { useEffect, useState } from "react";
import ArticleCommentLoading from "./article-comment-loading";
import ArticleCommentCard from "./article-comment-card";

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
  const limit = 3;

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
        {articleComments.data.map((comment) => (
          <ArticleCommentCard datum={comment} key={comment.id} />
        ))}
      </ul>
      {renderButtonCondition && (
        <Button
          onClick={() => handleLoadMore()}
          isLoading={articleComments.status === "loading"}
          className="w-full"
          variant="secondary"
        >
          Load More
        </Button>
      )}
    </>
  );
}
