import { Pagination } from "@/types/pagination.type";
import { Category } from "../category/types";
import { User } from "../auth/types";
import { Comment } from "../comment/types";

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
  category: Category | null | undefined;
  comments: Comment[] | undefined;
  user: User | undefined;
};

export type ArticleState = {
  articles: {
    data: {
      home: Article[];
      more: Article[];
    };
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null | undefined;
    meta: { pagination: Pagination } | undefined;
  };
  detail: {
    datum: Record<string, Article>;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null | undefined;
  };
  mutation: {
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null | undefined;
  };
  uploadedImgURL: string | null | undefined;
};

export const ArticleQueryParams = {
  PAGE: "pagination[page]",
  PAGE_SIZE: "pagination[pageSize]",
  CATEGORY: "filters[category][name][$eqi]",
} as const;

export type MutatePostArticleDto = {
  title: string;
  description: string;
  cover_image_url?: string | undefined;
  category?: number | undefined;
};
