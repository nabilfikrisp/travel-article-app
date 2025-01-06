import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchArticles } from "@/store/slices/article/articleSlice";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import ArticleList from "./components/article-list";
import EmptyArticles from "./components/empty";
import ArticleLoading from "./components/article-loading";
import ArticleCategoryBadge from "./components/article-category-badge";

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

  if (status === "loading") return <ArticleLoading />;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <div className="py-10">
      <div className="mb-5 flex items-center gap-4">
        <h1 className="text-3xl font-bold">Articles</h1>
        {params.category && <ArticleCategoryBadge category={params.category} />}
      </div>
      {data.length === 0 ? <EmptyArticles /> : <ArticleList data={data} />}
    </div>
  );
}
