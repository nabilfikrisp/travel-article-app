import ArticleCard from "@/app/articles/components/article-card";
import { Article } from "@/store/slices/article/types";
import { User } from "@/store/slices/auth/types";
import { Comment } from "@/store/slices/comment/types";

type MyCommentsListType = {
  comments: Comment[];
  user: User;
};

export default function MyCommentsList({ comments, user }: MyCommentsListType) {
  const groupedComments: Record<string, { article: Article; comments: Comment[] }> = {};

  comments.forEach((comment) => {
    const article = comment.article as Article;
    if (!groupedComments[article.documentId]) {
      groupedComments[article.documentId] = { article, comments: [] };
    }
    groupedComments[article.documentId].comments.push(comment);
  });

  return (
    <div>
      <ul className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(groupedComments).map(([articleId, { article, comments }]) => (
          <div key={articleId}>
            <ArticleCard datum={{ ...article, user: user }} withComments={false} />
            <div className="-mt-2 space-y-2 rounded-lg rounded-t-none border border-t-0 p-4">
              <p className="mb-2 text-xl font-bold">Your Comments</p>
              {comments.map((comment) => (
                <div key={comment.id}>
                  <p className="mb-2 rounded-xl border p-4">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}
