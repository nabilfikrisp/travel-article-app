import { useSearchParams } from "react-router";
import CategoryTable from "./category/category-table";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useMemo } from "react";
import { fetchCategories } from "@/store/slices/category/categorySlice";
import { CreateCategoryDialogForm } from "./category/components/create-category-dialog-form";

export default function SuperAdminPage() {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((state) => state.category.categories);
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
    dispatch(fetchCategories(params));
  }, [dispatch, params]);

  if (status === "loading") return <p className="py-10">Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div className="py-10">
      <div className="mb-5 flex flex-wrap justify-between gap-5">
        <h1 className="text-3xl font-bold">All Categories</h1>
        <CreateCategoryDialogForm />
      </div>
      <CategoryTable categories={data} />
    </div>
  );
}
