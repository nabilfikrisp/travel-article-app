import { useAppSelector } from "@/store/hooks";
import { Navigate } from "react-router";
import MyArticlesLoading from "./my-articles-loading";
import { ArticleChart } from "./article-chart";

export default function ArticleChartDataFetcher() {
  const { user, status, error } = useAppSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" />;
  if (!user.articles) return <MyArticlesLoading />;
  if (status === "loading") return <MyArticlesLoading />;
  if (status === "failed") return <div>Error: {error}</div>;

  const topFiveArticles = user.articles
    .filter((article) => article.comments && article.publishedAt !== null)
    .map((article) => ({
      title: article.title,
      comments: article.comments?.filter((comment) => comment.publishedAt !== null).length || 0,
    }))
    .sort((a, b) => b.comments - a.comments)
    .slice(0, 5);

  return <ArticleChart topArticles={topFiveArticles} />;
}
