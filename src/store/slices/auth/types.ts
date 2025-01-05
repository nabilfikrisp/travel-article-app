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
};

export type AuthState = {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | undefined;
  jwt: string | null;
};
