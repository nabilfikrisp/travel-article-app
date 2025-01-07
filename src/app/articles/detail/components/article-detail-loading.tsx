import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ArticleCommentLoading from "./article-comment-loading";

export default function ArticleDetailLoading() {
  return (
    <div className="py-10">
      <Skeleton className="mb-5 text-3xl font-bold text-transparent">kebumen</Skeleton>

      <Skeleton className="mb-5 aspect-video max-h-[500px] w-full rounded-lg text-transparent" />

      <div className="mb-5 flex flex-wrap gap-2">
        <Skeleton className="text-transparent">Author: Nabil</Skeleton>
        <Separator orientation="vertical" />
        <Skeleton className="text-transparent">Author: Nabil</Skeleton>
        <Separator orientation="vertical" />
        <Skeleton className="text-transparent">Author: Nabil</Skeleton>
      </div>
      <Skeleton className="mb-5 text-transparent">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, temporibus.
      </Skeleton>
      <Separator className="my-5 bg-primary" />
      <Skeleton className="mb-5 text-2xl font-bold text-transparent">Comments</Skeleton>
      <Skeleton className="mb-4 h-20" />
      <Skeleton className="mb-5 h-10" />
      <ArticleCommentLoading />
    </div>
  );
}
