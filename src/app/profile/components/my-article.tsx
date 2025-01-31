import { Button } from "@/components/ui/button";

import { Link, Navigate } from "react-router";
import MyArticlesLoading from "./my-articles-loading";
import { useAppSelector } from "@/store/hooks";
import MyArticlesList from "./my-articles-list";

export default function MyArticles() {
  const { user, status, error } = useAppSelector((state) => state.auth);

  function renderHeader() {
    return (
      <div className="mb-5 flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">My Articles</h1>
        </div>
        <Button asChild>
          <Link to="/articles/create">Create Your Own Article!</Link>
        </Button>
      </div>
    );
  }

  function renderContent() {
    if (!user) return <Navigate to="/login" />;
    if (!user.articles) return <MyArticlesLoading />;
    if (status === "loading") return <MyArticlesLoading />;
    if (status === "failed") return <div>Error: {error}</div>;
    return (
      <MyArticlesList articles={user.articles.filter((article) => article.publishedAt !== null)} />
    );
  }

  return (
    <div className="py-10">
      {renderHeader()}
      {renderContent()}
    </div>
  );
}
