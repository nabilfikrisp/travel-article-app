import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch } from "@/store/hooks";
import { fetchGetMe } from "@/store/slices/auth/authSlice";
import { useEffect } from "react";
import MyArticles from "./components/my-article";
import MyComents from "./components/my-comments";
import ArticleChartDataFetcher from "./components/article-chart-data-fethcer";
import { useSearchParams } from "react-router";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    dispatch(fetchGetMe());
  }, [dispatch]);

  const currentTab = searchParams.get("tab") || "articles";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <Tabs
      defaultValue={currentTab}
      value={currentTab}
      onValueChange={(value) => handleTabChange(value)}
      className="py-10"
    >
      <TabsList>
        <TabsTrigger value="articles">My Articles</TabsTrigger>
        <TabsTrigger value="comments">My Comments</TabsTrigger>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
      </TabsList>
      <TabsContent value="articles">
        <MyArticles />
      </TabsContent>
      <TabsContent value="comments">
        <MyComents />
      </TabsContent>
      <TabsContent value="dashboard">
        <ArticleChartDataFetcher />
      </TabsContent>
    </Tabs>
  );
}
