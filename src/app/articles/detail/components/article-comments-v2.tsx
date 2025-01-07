import { Comment } from "@/store/slices/comment/types";
import ArticleCommentCard from "./article-comment-card";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ArticleCommentsV2({
  comments,
  articleDocumentId,
}: {
  comments: Comment[];
  articleDocumentId: string;
}) {
  const [visibleCount, setVisibleCount] = useState(5);
  const hasMore = visibleCount < comments.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <>
      <ul className="mb-5 flex flex-col gap-4">
        {comments
          .slice()
          .reverse()
          .slice(0, visibleCount)
          .map((comment) => (
            <ArticleCommentCard
              datum={comment}
              key={comment.id}
              articleDocumentId={articleDocumentId}
            />
          ))}
      </ul>
      {hasMore && (
        <Button onClick={handleLoadMore} className="w-full">
          Load More
        </Button>
      )}
    </>
  );
}
