import { useAppSelector } from "@/store/hooks";
import { Navigate } from "react-router";
import MyArticlesLoading from "./my-articles-loading";
import MyCommentsList from "./my-comments-list";

export default function MyComents() {
  const { user, status, error } = useAppSelector((state) => state.auth);

  function renderHeader() {
    return (
      <div className="mb-5 flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">My Comments</h1>
        </div>
      </div>
    );
  }

  function renderContent() {
    if (!user) return <Navigate to="/login" />;
    if (!user.comments) return <MyArticlesLoading />;
    if (status === "loading") return <MyArticlesLoading />;
    if (status === "failed") return <div>Error: {error}</div>;
    return (
      <MyCommentsList
        comments={user.comments.filter(
          (comment) => comment.publishedAt !== null && comment.article
        )}
        user={user}
      />
    );
  }

  return (
    <div className="py-10">
      {renderHeader()}
      {renderContent()}
    </div>
  );
}
