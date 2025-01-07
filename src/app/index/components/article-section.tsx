import ArticleCard from "@/app/articles/components/article-card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchArticles } from "@/store/slices/article/articleSlice";
import { ArrowRightIcon } from "lucide-react";
import { ComponentPropsWithoutRef, useEffect } from "react";
import { Link } from "react-router";
import ArticleSectionLoading from "./article-section-loading";

type ArticleSectionProps = ComponentPropsWithoutRef<"div">;

export default function ArticleSection({ className, ...props }: ArticleSectionProps) {
  const dispatch = useAppDispatch();
  const { data, error, status } = useAppSelector((state) => state.article.articles);

  useEffect(() => {
    if (data.home.length !== 0) return;

    dispatch(fetchArticles({ pageSize: 6 }));
  }, [dispatch, data]);

  if (status === "loading") return <ArticleSectionLoading />;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <section id="articles" className={className} {...props}>
      <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Latest Articles</h1>
        <Link to="/articles" className="group flex items-center hover:text-primary">
          More Articles
          <ArrowRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <ul className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.home.map((article) => (
          <ArticleCard key={article.id} datum={article} />
        ))}
      </ul>
    </section>
  );
}
