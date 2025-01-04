import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchArticles } from "@/store/slices/articleSlice";
import { useEffect } from "react";
import ArticleList from "./components/article-list";
import EmptyArticles from "./components/empty";
import ArticleLoading from "./components/article-loading";
import ArticleListPagination from "./components/article-list-pagination";

export default function ArticlesPage() {
  const dispatch = useAppDispatch();
  const { data, error, status } = useAppSelector((state) => state.article);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchArticles());
    }
  }, [dispatch, status]);

  if (status === "loading") return <ArticleLoading />;
  if (status === "failed") return <div>Error: {error} ini</div>;

  return (
    <div className="py-10">
      <div className="mb-5 flex flex-col sm:items-center justify-between gap-4 sm:flex-row">
        <h1 className="text-3xl font-bold">Articles</h1>
        <ArticleListPagination />
      </div>
      {data.length === 0 ? <EmptyArticles /> : <ArticleList data={data} />}
    </div>
  );
}
