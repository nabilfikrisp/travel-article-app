import { Article } from "@/store/slices/article/types";
import ArticleCard from "./article-card";
import ArticleListPagination from "./article-list-pagination";

type ArticleListProps = {
  data: Article[];
};

export default function ArticleList({ data }: ArticleListProps) {
  return (
    <div>
      <ul className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((article) => (
          <ArticleCard key={article.id} datum={article} />
        ))}
      </ul>
      <ArticleListPagination />
    </div>
  );
}
