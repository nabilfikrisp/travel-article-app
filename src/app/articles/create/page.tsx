import { useEffect } from "react";
import CreateArticleForm from "./components/create-article-form";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/category/categorySlice";

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
      <CreateArticleForm categories={data} />
    </div>
  );
}
