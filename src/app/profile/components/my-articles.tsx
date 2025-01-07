import ArticleCard from "@/app/articles/components/article-card";
import { Article } from "@/store/slices/article/types";

type MyArticlesProps = {
  articles: Article[];
};

export default function MyArticles({ articles }: MyArticlesProps) {
  return (
    <div>
      <ul className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => {
          console.log(article);
          return <ArticleCard datum={article} key={article.id} />;
        })}
      </ul>
    </div>
  );
}
