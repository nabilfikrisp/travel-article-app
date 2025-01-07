import { Article } from "../article/types";
import { Comment } from "../comment/types";

export type AuthResponse = {
  jwt: string;
  user: User;
};

export type RegisterRequestDTO = {
  username: string;
  email: string;
  password: string;
};

export type LoginRequestDTO = {
  identifier: string;
  password: string;
};

export type User = {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: null | string;
  role:
    | {
        id: number;
        documentId: string;
        name: string;
        description: string;
        type: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        locale: null;
      }
    | undefined;
  articles: Article[] | undefined;
  comments: Comment[] | undefined;
};

export type AuthState = {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | undefined;
  jwt: string | null;
};
