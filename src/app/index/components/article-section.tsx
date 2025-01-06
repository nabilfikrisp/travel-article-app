import ArticleCard from "@/app/articles/components/article-card";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchArticles } from "@/store/slices/article/articleSlice";
import { ArrowRightIcon } from "lucide-react";
import { ComponentPropsWithoutRef, useEffect } from "react";
import { Link } from "react-router";

type ArticleSection = ComponentPropsWithoutRef<"div">;

export default function ArticleSection({ className, ...props }: ArticleSection) {
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
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <h1 className="mb-5 text-3xl font-bold">Latest Articles</h1>
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

function ArticleSectionLoading({ className, ...props }: ArticleSection) {
  return (
    <section id="articles" className={className} {...props}>
      <h1 className="mb-5 text-3xl font-bold">Latest Articles</h1>
      <ul className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card
            key={index}
            className="group flex h-[450px] flex-col overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <div className="relative h-[200px] overflow-hidden">
              <Skeleton className="h-full w-full" />
            </div>

            <CardContent className="flex flex-1 flex-col pt-6">
              <h2 className="mb-3 line-clamp-2 text-xl font-bold leading-tight group-hover:text-primary">
                <Skeleton className="text-transparent">Kebumen</Skeleton>
              </h2>

              <Skeleton className="line-clamp-3 text-transparent">
                Ini Di Daerah Kebumen Pada Saat Pagi Hari Di Saat Orang-orang sudah mulai melakukan
                pekerjaan
              </Skeleton>

              <div className="mt-auto pt-4">
                <span className="inline-flex items-center text-sm font-medium text-primary group-hover:text-primary">
                  <Skeleton className="text-transparent">Read More</Skeleton>
                </span>
              </div>
            </CardContent>

            <CardFooter className="border-t bg-muted">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm">
                  <Skeleton className="text-transparent">0 comments</Skeleton>
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </ul>
    </section>
  );
}
