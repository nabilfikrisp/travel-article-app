export type ApiResponse<T, Meta = undefined> = {
  data: T;
  meta: Meta;
};
