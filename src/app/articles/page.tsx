import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchArticles } from "@/store/slices/articlesSlice";
import { useEffect } from "react";
import ArticleList from "./components/article-list";
import EmptyArticles from "./components/empty";

export default function ArticlesPage() {
  const dispatch = useAppDispatch();
  const { data, error, status } = useAppSelector((state) => state.articles);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchArticles());
    }
  }, [dispatch, status]);

  if (status === "loading") return <div>Loading....</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  console.log(data);

  return (
    <div>
      <h1>Articles</h1>
      {data.length === 0 ? <EmptyArticles /> : <ArticleList data={data} />}
    </div>
  );
}
