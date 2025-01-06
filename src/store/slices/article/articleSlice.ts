import apiClient from "@/configs/axios-interceptor";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Article, ArticleQueryParams, ArticleState } from "./types";
import { ApiResponse } from "@/types/api-response.type";
import { AxiosError } from "axios";
import { Pagination } from "@/types/pagination.type";

const initialState: ArticleState = {
  articles: {
    data: [],
    status: "idle",
    error: null,
    meta: undefined,
  },
  detail: {
    datum: null,
    status: "idle",
    error: null,
  },
  mutation: {
    status: "idle",
    error: null,
  },
};

type FetchArticlesParams =
  | {
      pageSize?: number;
      page?: number;
      category?: string;
    }
  | undefined;

export const fetchArticles = createAsyncThunk(
  "articles/fetchArticles",
  async (params: FetchArticlesParams = {}, { rejectWithValue }) => {
    try {
      const { pageSize = 9, page = 1, category } = params;

      const response = await apiClient.get<ApiResponse<Article[], { pagination: Pagination }>>(
        "/articles",
        {
          params: {
            populate: "*",
            [ArticleQueryParams.PAGE_SIZE]: pageSize,
            [ArticleQueryParams.PAGE]: page,
            ...(category && { [ArticleQueryParams.CATEGORY]: category }),
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || error.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const fetchArticleByDocumentId = createAsyncThunk(
  "articles/fetchArticleByDocumentId",
  async (documentId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<ApiResponse<Article>>(`/articles/${documentId}`, {
        params: {
          populate: "*",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response ? error.response.data.error.message : error.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // FETCH ALL
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.articles.status = "loading";
        state.articles.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.articles.status = "succeeded";
        state.articles.data = action.payload.data;
        state.articles.meta = action.payload.meta;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.articles.status = "failed";
        state.articles.error = action.payload as string;
      });

    // FETCH BY ID
    builder
      .addCase(fetchArticleByDocumentId.pending, (state) => {
        state.detail.status = "loading";
        state.detail.error = null;
      })
      .addCase(fetchArticleByDocumentId.fulfilled, (state, action) => {
        state.detail.status = "succeeded";
        state.detail.datum = action.payload.data;
      })
      .addCase(fetchArticleByDocumentId.rejected, (state, action) => {
        state.detail.status = "failed";
        state.detail.error = action.payload as string;
      });
  },
});

const articleReducer = articleSlice.reducer;
export default articleReducer;
