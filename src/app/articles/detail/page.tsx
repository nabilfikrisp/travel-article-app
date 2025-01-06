import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchArticleByDocumentId } from "@/store/slices/article/articleSlice";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router";
import ArticleDetail from "./components/article-detail";
import ArticleDetailLoading from "./components/article-detail-loading";

export function ArticleDetailPage() {
  const { documentId } = useParams();
  const dispatch = useAppDispatch();
  const { datum, status, error } = useAppSelector((state) => state.article.detail);

  useEffect(() => {
    if (!documentId) return;
    if (datum[documentId]) return;

    dispatch(fetchArticleByDocumentId(documentId));
  }, [dispatch, documentId, datum]);

  if (status === "loading")
    return (
      <div className="py-10">
        <ArticleDetailLoading />;
      </div>
    );
  if (status === "failed") return <div>Error: {error}</div>;
  if (!documentId) return <Navigate to="/articles" />;

  return (
    <div className="py-10">
      <ArticleDetail documentId={documentId} />
    </div>
  );
}
