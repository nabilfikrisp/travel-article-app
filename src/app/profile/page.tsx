import { useEffect } from "react";
import MyArticles from "./components/my-articles";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGetMe } from "@/store/slices/auth/authSlice";
import { Link, Navigate } from "react-router";
import MyArticlesLoading from "./components/my-articles-loading";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchGetMe());
  }, [dispatch]);

  function renderHeader() {
    return (
      <div className="mb-5 flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Articles</h1>
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
      <MyArticles articles={user.articles.filter((article) => article.publishedAt !== null)} />
    );
  }

  return (
    <div className="py-10">
      {renderHeader()}
      {renderContent()}
    </div>
  );
}
