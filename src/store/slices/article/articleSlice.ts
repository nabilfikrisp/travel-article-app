import apiClient from "@/configs/axios-interceptor";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Article, ArticleState } from "./types";
import { ApiResponse } from "@/types/api-response.type";
import { AxiosError } from "axios";

const initialState: ArticleState = {
  data: [],
  status: "idle",
  error: null,
  meta: undefined,
};

type FetchArticlesParams = {
  pageSize?: number;
  page?: number;
};

export const fetchArticles = createAsyncThunk(
  "articles/fetchArticles",
  async (params: FetchArticlesParams = {}, { rejectWithValue }) => {
    try {
      const { pageSize = 9, page = 1 } = params;
      const response = await apiClient.get<ApiResponse<Article[]>>("/articles", {
        params: {
          populate: "*",
          "pagination[pageSize]": pageSize,
          "pagination[page]": page,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || error.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const articlesSlice = createSlice({
  name: "articles",
  initialState,
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
        state.error = action.payload as string;
      });
  },
});

const articlesReducer = articlesSlice.reducer;
export default articlesReducer;
