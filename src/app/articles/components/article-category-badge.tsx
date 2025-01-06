import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/store/hooks";
import { fetchArticles } from "@/store/slices/article/articleSlice";
import { XIcon } from "lucide-react";
import { useSearchParams } from "react-router";

type ArticleCategoryBadgeProps = {
  category: string;
};

export default function ArticleCategoryBadge({ category }: ArticleCategoryBadgeProps) {
  const dispatch = useAppDispatch();
  const [, setSearchParams] = useSearchParams();

  function handleBadgeClose() {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.delete("category");

      return newParams;
    });

    dispatch(fetchArticles());
  }

  return (
    <Badge className="hover:bg-primary">
      {category}{" "}
      <XIcon className="ml-1 h-4 w-4 hover:cursor-pointer" onClick={() => handleBadgeClose()} />
    </Badge>
  );
}
