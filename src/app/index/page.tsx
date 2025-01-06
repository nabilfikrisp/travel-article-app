import ArticleSection from "./components/article-section";
import PopularCategories from "./components/popular-categories";

export default function MainPage() {
  return (
    <div className="py-10">
      <PopularCategories className="mb-10" />
      <ArticleSection />
    </div>
  );
}
