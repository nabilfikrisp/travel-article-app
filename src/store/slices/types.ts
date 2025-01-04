export type Article = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  cover_image_url: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: null;
  category: null;
  comments: [] | undefined;
};

export type ArticlesState = {
  data: Article[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | undefined;
};
