import apiClient from "@/configs/axios-interceptor";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Article, ArticleQueryParams, ArticleState, MutatePostArticleDto } from "./types";
import { ApiResponse } from "@/types/api-response.type";
import { AxiosError } from "axios";
import { Pagination } from "@/types/pagination.type";

const initialState: ArticleState = {
  articles: {
    data: {
      home: [],
      more: [],
    },
    status: "idle",
    error: null,
    meta: undefined,
  },
  detail: {
    datum: {},
    status: "idle",
    error: null,
  },
  mutation: {
    status: "idle",
    error: null,
  },
  uploadedImgURL: null,
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

export const mutatePostArticle = createAsyncThunk(
  "articles/mutatePostArticle",
  async (dto: MutatePostArticleDto, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<ApiResponse<Article>>(
        "/articles",
        {
          data: dto,
        },
        {
          params: {
            populate: "*",
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response ? error.response.data.error.message : error.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const mutatePostImage = createAsyncThunk(
  "articles/mutatePostImage",
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<
        {
          url: string;
        }[]
      >("/upload", { files: file }, { headers: { "Content-Type": "multipart/form-data" } });

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
  reducers: {
    pushCommentToArticle(state, action) {
      const { articleDocumentId, comment } = action.payload;
      if (state.detail.datum[articleDocumentId]) {
        state.detail.datum[articleDocumentId].comments?.push(comment);
      }
      if (state.articles.data.home.length > 0) {
        state.articles.data.home
          .find((article) => article.documentId === articleDocumentId)
          ?.comments?.push(comment);
      }
    },
    updateCommentOfArticle(state, action) {
      const { articleDocumentId, comment } = action.payload;
      if (state.detail.datum[articleDocumentId]) {
        state.detail.datum[articleDocumentId].comments = state.detail.datum[
          articleDocumentId
        ].comments?.map((item) => (item.id === comment.id ? comment : item));
      }
      if (state.articles.data.home.length > 0) {
        state.articles.data.home = state.articles.data.home.map((article) =>
          article.documentId === articleDocumentId
            ? { ...article, comments: state.detail.datum[articleDocumentId].comments }
            : article
        );
      }
    },
    deleteCommentFromArticle(state, action) {
      const { articleDocumentId, commentDocumentId } = action.payload;
      if (state.detail.datum[articleDocumentId]) {
        state.detail.datum[articleDocumentId].comments = state.detail.datum[
          articleDocumentId
        ].comments?.filter((comment) => comment.documentId !== commentDocumentId);
      }
      if (state.articles.data.home.length > 0) {
        state.articles.data.home = state.articles.data.home.map((article) => {
          if (article.documentId === articleDocumentId) {
            return {
              ...article,
              comments: article.comments?.filter(
                (comment) => comment.documentId !== commentDocumentId
              ),
            };
          }
          return article;
        });
      }
    },
  },
  extraReducers: (builder) => {
    // FETCH ALL
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.articles.error = null;
        state.articles.status = "loading";
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        if (state.articles.data.home.length === 0 && !action.meta.arg?.category) {
          state.articles.data.home = action.payload.data;
        }
        state.articles.data.more = action.payload.data;
        state.articles.meta = action.payload.meta;
        state.articles.status = "succeeded";
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.articles.error = action.payload as string;
        state.articles.status = "failed";
      })

      // FETCH BY ID
      .addCase(fetchArticleByDocumentId.pending, (state) => {
        state.detail.error = null;
        state.detail.status = "loading";
      })
      .addCase(fetchArticleByDocumentId.fulfilled, (state, action) => {
        const documentId = action.meta.arg;
        if (!state.detail.datum[documentId]) {
          state.detail.datum[documentId] = action.payload.data;
        }
        state.detail.status = "succeeded";
      })
      .addCase(fetchArticleByDocumentId.rejected, (state, action) => {
        state.detail.error = action.payload as string;
        state.detail.status = "failed";
      })

      // MUTATE POST
      .addCase(mutatePostArticle.pending, (state) => {
        state.mutation.error = null;
        state.mutation.status = "loading";
      })
      .addCase(mutatePostArticle.fulfilled, (state, action) => {
        if (state.articles.data.home.length > 0) {
          state.articles.data.home.pop();
        }
        state.articles.data.home.unshift(action.payload.data);
        state.mutation.status = "succeeded";
      })
      .addCase(mutatePostArticle.rejected, (state, action) => {
        state.mutation.error = action.payload as string;
        state.mutation.status = "failed";
      })

      // MUTATE POST IMAGE
      .addCase(mutatePostImage.pending, (state) => {
        state.mutation.error = null;
        state.mutation.status = "loading";
      })
      .addCase(mutatePostImage.fulfilled, (state, action) => {
        state.uploadedImgURL = action.payload[0].url;
        state.mutation.status = "succeeded";
      })
      .addCase(mutatePostImage.rejected, (state, action) => {
        state.mutation.error = action.payload as string;
        state.mutation.status = "failed";
      });
  },
});

export const articleSliceAction = articleSlice.actions;
const articleReducer = articleSlice.reducer;
export default articleReducer;
