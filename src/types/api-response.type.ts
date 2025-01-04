import { Pagination } from "./pagination.type";

export type ApiResponse<T> = {
  data: T;
  meta: {
    pagination: Pagination;
  };
};
