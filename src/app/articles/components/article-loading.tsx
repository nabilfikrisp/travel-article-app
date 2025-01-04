import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleLoading() {
  return (
    <div className="py-10">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Skeleton className="h-10 w-52" />
      </div>
      <div>
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
                <p className="line-clamp-3 text-muted-foreground">
                  <Skeleton className="text-transparent">
                    Ini Di Daerah Kebumen Pada Saat Pagi Hari Di Saat Orang-orang sudah mulai
                    melakukan pekerjaan
                  </Skeleton>
                </p>
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
      </div>
    </div>
  );
}
