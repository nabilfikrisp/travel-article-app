import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/category/categorySlice";
import { useParams } from "react-router";
import ArticleForm from "../../components/article-form";

export default function ArticleDetailEditPage() {
  const { documentId } = useParams();
  if (!documentId) return <>Loading...</>;

  return <ArticleditContent documentId={documentId} />;
}

function ArticleditContent({ documentId }: { documentId: string }) {
  const datum = useAppSelector((state) => state.article.detail.datum[documentId]);
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.category.categories);

  useEffect(() => {
    if (data.length > 0) return;

    dispatch(fetchCategories());
  }, [data.length, dispatch]);

  if (!datum) return <div>Article Not Found</div>;
  return (
    <div className="py-10">
      <h1 className="mb-5 text-3xl font-bold">Edit Article!</h1>
      <ArticleForm
        categories={data}
        initialData={{
          title: datum.title,
          description: datum.description,
          cover_image_url: datum.cover_image_url,
          category: datum.category,
          articleDocumentId: documentId,
        }}
      />
    </div>
  );
}
