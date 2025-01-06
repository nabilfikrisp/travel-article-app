import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategories } from "@/store/slices/category/categorySlice";
import { ComponentPropsWithoutRef, useEffect } from "react";
import { Link } from "react-router";

type PopularCategoriesProps = ComponentPropsWithoutRef<"div">;

export default function PopularCategories({ className, ...props }: PopularCategoriesProps) {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((state) => state.category.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (status === "loading") return <CategoryLoading className={className} {...props} />;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <section id="popular-categories" className={className} {...props}>
      <h1 className={cn("mb-5 text-3xl font-bold")}>Popular Categories</h1>
      <div className="flex flex-wrap gap-2">
        {data.length > 0 ? (
          data.map((datum) => (
            <Badge key={datum.id} className="hover:cursor-pointer">
              <Link to={{ pathname: "/articles", search: `?category=${datum.name}` }}>
                {datum.name}
              </Link>
            </Badge>
          ))
        ) : (
          <div>No Category Found</div>
        )}
      </div>
    </section>
  );
}

function CategoryLoading({ className, ...props }: PopularCategoriesProps) {
  return (
    <section id="popular-categories" className={className} {...props}>
      <h1 className={cn("mb-5 text-3xl font-bold")}>Popular Categories</h1>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton className="h-[22px] w-12 rounded-full text-transparent" key={index}>
            city
          </Skeleton>
        ))}
      </div>
    </section>
  );
}
