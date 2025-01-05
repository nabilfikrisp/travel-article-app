import { Pagination } from "@/types/pagination.type";

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
  category: ArticleCategory | null | undefined;
  comments: ArticleComment[] | undefined;
};

export type ArticleComment = {
  content: string;
  createdAt: string;
  documentId: string;
  id: number;
  locale: null;
  publishedAt: string;
  updatedAt: string;
};

export type ArticleCategory = {
  id: number;
  documentId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: null;
};

export type ArticleState = {
  data: Article[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | undefined;
  meta: { pagination: Pagination } | undefined;
};
