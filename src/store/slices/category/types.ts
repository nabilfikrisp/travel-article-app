import { Pagination } from "@/types/pagination.type";

export type Category = {
  id: number;
  documentId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: null;
};

export type CategoryState = {
  categories: {
    data: Category[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null | undefined;
    meta: { pagination: Pagination } | undefined;
  };
  detail: {
    datum: Category | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null | undefined;
  };
  mutation: {
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null | undefined;
  };
};
