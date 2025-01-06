import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDetailedComments } from "@/store/slices/comment/commentSlice";
import { useEffect, useState } from "react";
import ArticleCommentLoading from "./article-comment-loading";

type ArticleCommentsType = {
  documentIds: string[];
  articleDocumentId: string;
};

export default function ArticleComments({ articleDocumentId, documentIds }: ArticleCommentsType) {
  const dispatch = useAppDispatch();
  const articleComments = useAppSelector(
    (state) => state.comment.articleComments[articleDocumentId]
  );
  const [offset, setOffset] = useState(0);
  const limit = 5;

  useEffect(() => {
    if (offset !== 0 || articleComments) return;

    dispatch(
      fetchDetailedComments({
        arrayOfDocumentIds: documentIds.slice(0, limit),
        articleDocumentId,
        isLoadMore: true,
      })
    );
  }, [dispatch, articleDocumentId, documentIds, offset, articleComments]);

  const handleLoadMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);

    dispatch(
      fetchDetailedComments({
        arrayOfDocumentIds: documentIds.slice(newOffset, newOffset + limit),
        articleDocumentId,
      })
    );
  };

  if (!articleComments) return <ArticleCommentLoading />;
  if (articleComments.status === "loading" && offset === 0) return <ArticleCommentLoading />;
  if (articleComments.status === "failed") return <p>Error: {articleComments.error}</p>;

  return (
    <ul>
      {articleComments.data.map((comment, index) => (
        <li key={comment.id}>
          {index + 1}. {comment.content}
        </li>
      ))}
      {offset + limit < documentIds.length && (
        <Button onClick={() => handleLoadMore()}>Load More</Button>
      )}
    </ul>
  );
}
