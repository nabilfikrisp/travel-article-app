import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDetailedComments } from "@/store/slices/comment/commentSlice";
import { useEffect, useState } from "react";

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
    if (offset === 0) {
      dispatch(
        fetchDetailedComments({
          arrayOfDocumentIds: documentIds.slice(0, limit),
          articleDocumentId,
          isLoadMore: true,
        })
      );
    }
  }, [dispatch, articleDocumentId, documentIds, offset]);

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
  if (articleComments.status === "loading") return <ArticleCommentLoading />;
  if (articleComments.status === "failed") return <p>Error: {articleComments.error}</p>;

  return (
    <ul>
      {articleComments.data.map((comment, index) => (
        <li key={comment.id}>
          {index}. {comment.content}
        </li>
      ))}
      {offset + limit < documentIds.length && (
        <Button onClick={() => handleLoadMore()}>Load More</Button>
      )}
    </ul>
  );
}

function ArticleCommentLoading() {
  return (
    <ul className="mb-5 flex flex-col gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="overflow-hidden rounded-lg border border-foreground p-4" key={index}>
          <div className="mb-2 flex items-center gap-2">
            <span className="font-semibold">
              <Skeleton className="text-transparent">nabil</Skeleton>
            </span>
            <span className="text-sm">
              <Skeleton className="text-transparent">18 Januari 2025</Skeleton>
            </span>
          </div>

          <Skeleton className="text-transparent">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          </Skeleton>
        </div>
      ))}
    </ul>
  );
}
