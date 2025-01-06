import { formatISODate } from "@/lib/format-iso-date";
import { CommentDetail } from "@/store/slices/comment/types";

type ArticleCommendCardProps = {
  datum: CommentDetail;
};

export default function ArticleCommentCard({ datum }: ArticleCommendCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-foreground p-4">
      <div className="flex gap-2 items-center mb-2">
        <span className="font-semibold">{datum.user.username}</span>
        <span className="text-sm">{formatISODate(datum.publishedAt)}</span>
      </div>
      <p>{datum.content}</p>
    </div>
  );
}
