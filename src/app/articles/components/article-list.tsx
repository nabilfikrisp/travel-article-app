import { Article } from "@/store/slices/types";

type ArticleListProps = {
  data: Article[];
};

export default function ArticleList({ data }: ArticleListProps) {
  return (
    <ul>
      {data.map((article) => (
        <li key={article.id}>{article.title}</li>
      ))}
    </ul>
  );
}
