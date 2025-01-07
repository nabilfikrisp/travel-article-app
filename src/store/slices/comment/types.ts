import { Pagination } from "@/types/pagination.type";
import { Article } from "../article/types";
import { User } from "../auth/types";

export type Comment = {
  id: number;
  documentId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: null;
  article?: Article | null | undefined;
  localizations?: [] | undefined;
};

export type CommentDetail = Comment & {
  user: User;
};

export type CommentState = {
  comments: {
    data: Comment[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null | undefined;
    meta: { pagination: Pagination } | undefined;
  };
  detail: {
    datum: CommentDetail | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null | undefined;
  };
  articleComments: {
    [articleId: string]: {
      data: CommentDetail[];
      status: "idle" | "loading" | "succeeded" | "failed";
      error: string | null;
    };
  };
  mutation: {
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null | undefined;
  };
};
