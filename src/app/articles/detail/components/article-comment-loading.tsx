import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleCommentLoading() {
  return (
    <ul className="mb-5 flex flex-col gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="overflow-hidden rounded-lg border border-foreground p-4" key={index}>
          <div className="mb-2 flex items-center gap-2">
            <span className="font-semibold">
              <Skeleton className="text-transparent">nabil</Skeleton>
            </span>
            <span className="text-sm">
              <Skeleton className="text-transparent">18 Januari 2025</Skeleton>
            </span>
          </div>

          <Skeleton className="text-transparent">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          </Skeleton>
        </div>
      ))}
    </ul>
  );
}
