import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatISODate } from "@/lib/format-iso-date";
import { Article } from "@/store/slices/article/types";
import { ArrowRightIcon, ClockIcon, MessageCircleIcon, UserIcon } from "lucide-react";
import { Link } from "react-router";

type ArticleCardProps = {
  datum: Article;
  withComments?: boolean;
};

export default function ArticleCard({ datum, withComments = true }: ArticleCardProps) {
  return (
    <Card className="group flex h-[450px] flex-col overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-[200px] overflow-hidden">
        {datum.cover_image_url ? (
          <img
            src={datum.cover_image_url}
            alt={datum.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Skeleton className="h-full w-full" />
        )}

        {datum.category && (
          <div className="absolute left-4 top-4">
            <Badge variant="secondary" className="bg-background/90 text-foreground">
              {datum.category?.name || "Uncategorized"}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col pt-4">
        <div className="mb-2 flex items-center gap-4">
          <div className="flex items-center text-xs">
            <UserIcon className="mr-1 h-4 w-4" />
            <span className="font-bold">{datum.user?.username || "-"}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="mr-1 h-3 w-3" />
            <span className="text-xs">{formatISODate(datum.publishedAt)}</span>
          </div>
        </div>
        <h2 className="mb-3 line-clamp-2 text-xl font-bold leading-tight group-hover:text-primary">
          {datum.title}
        </h2>
        <p className="line-clamp-3 text-muted-foreground">{datum.description}</p>
        <Link to={`/articles/${datum.documentId}`} className="mt-auto pt-4 hover:cursor-pointer">
          <span className="inline-flex items-center text-sm font-medium text-primary group-hover:text-primary">
            Read more
            <ArrowRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </CardContent>

      {withComments && (
        <CardFooter className="border-t bg-muted py-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageCircleIcon className="h-4 w-4" />
            <span className="text-sm">{datum.comments?.length || 0} Comments</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
