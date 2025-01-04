import apiClient from "@/configs/axios-interceptor";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Article, ArticleState } from "./types";
import { ApiResponse } from "@/types/api-response.type";

const initialState: ArticleState = {
  data: [],
  status: "idle",
  error: null,
  meta: undefined,
};

type FetchArticlesParams =
  | {
      pageSize?: number;
      page?: number;
    }
  | undefined;

export const fetchArticles = createAsyncThunk("data/fetchData", async (params: FetchArticlesParams = {}) => {
  const { pageSize = 9, page = 1 } = params;
  const response = await apiClient.get<ApiResponse<Article[]>>("/articles", {
    params: {
      populate: "*",
      "pagination[pageSize]": pageSize,
      "pagination[page]": page,
    },
  });
  return response.data;
});

const articlesSlice = createSlice({
  name: "articles",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

const articlesReducer = articlesSlice.reducer;
export default articlesReducer;
