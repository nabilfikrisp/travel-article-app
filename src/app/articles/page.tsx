import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchArticles } from "@/store/slices/article/articleSlice";
import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import ArticleList from "./components/article-list";
import EmptyArticles from "./components/empty";
import ArticleLoading from "./components/article-loading";
import ArticleCategoryBadge from "./components/article-category-badge";
import { Button } from "@/components/ui/button";

export default function ArticlesPage() {
  const dispatch = useAppDispatch();
  const { data, error, status } = useAppSelector((state) => state.article.articles);
  const [searchParams] = useSearchParams();

  const params = useMemo(
    () => ({
      page: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || undefined,
      category: searchParams.get("category") || undefined,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams.toString()]
  );

  useEffect(() => {
    dispatch(fetchArticles(params));
  }, [dispatch, params]);

  function renderHeader() {
    return (
      <div className="mb-5 flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Articles</h1>
          {params.category && <ArticleCategoryBadge category={params.category} />}
        </div>
        <Button asChild>
          <Link to="/articles/create">Create Your Own Article!</Link>
        </Button>
      </div>
    );
  }

  function renderContent() {
    if (status === "loading") return <ArticleLoading />;
    if (status === "failed") return <div>Error: {error}</div>;
    return data.more.length === 0 ? <EmptyArticles /> : <ArticleList data={data.more} />;
  }

  return (
    <div className="py-10">
      {renderHeader()}
      {renderContent()}
    </div>
  );
}
