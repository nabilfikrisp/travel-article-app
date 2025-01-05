import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchArticles } from "@/store/slices/article/articleSlice";
import { useEffect } from "react";
import ArticleList from "./components/article-list";
import EmptyArticles from "./components/empty";
import ArticleLoading from "./components/article-loading";
import { useSearchParams } from "react-router";

export default function ArticlesPage() {
  const dispatch = useAppDispatch();
  const { data, error, status } = useAppSelector((state) => state.article);
  const [searchParams] = useSearchParams();

  const initialPageParams = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const initialPageSizeParams = searchParams.get("pageSize")
    ? Number(searchParams.get("pageSize"))
    : undefined;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchArticles({ page: initialPageParams, pageSize: initialPageSizeParams }));
    }
  }, [dispatch, status, initialPageParams, initialPageSizeParams]);

  if (status === "loading") return <ArticleLoading />;
  if (status === "failed") return <div>Error: {error} ini</div>;

  return (
    <div className="py-10">
      <h1 className="mb-5 text-3xl font-bold">Articles</h1>
      {data.length === 0 ? <EmptyArticles /> : <ArticleList data={data} />}
    </div>
  );
}
