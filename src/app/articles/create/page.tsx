import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/category/categorySlice";
import ArticleForm from "../components/article-form";

export default function CreateArticlePage() {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.category.categories);

  useEffect(() => {
    if (data.length > 0) return;

    dispatch(fetchCategories());
  }, [data.length, dispatch]);

  return (
    <div className="py-10">
      <h1 className="mb-5 text-3xl font-bold">Create Your Own Article!</h1>
      <ArticleForm categories={data} />
    </div>
  );
}
