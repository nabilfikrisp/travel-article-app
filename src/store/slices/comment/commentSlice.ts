import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CommentDetail, CommentState } from "./types";
import apiClient from "@/configs/axios-interceptor";
import { ApiResponse } from "@/types/api-response.type";
import { AxiosError } from "axios";

const initialState: CommentState = {
  comments: {
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
  articleComments: {},
};

export const fetchCommentByDocumentId = createAsyncThunk(
  "comments/fetchArticleByDocumentId",
  async (documentId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<ApiResponse<CommentDetail>>(`/comments/${documentId}`, {
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

export const fetchDetailedComments = createAsyncThunk(
  "comments/fetchDetailedComments",
  async (
    {
      arrayOfDocumentIds,
      articleDocumentId,
      isLoadMore = false,
    }: { arrayOfDocumentIds: string[]; articleDocumentId: string; isLoadMore?: boolean },
    { rejectWithValue }
  ) => {
    console.log(articleDocumentId, "from action");
    try {
      const responses = await Promise.all(
        arrayOfDocumentIds.map(async (documentId) => {
          const response = await apiClient.get<ApiResponse<CommentDetail>>(
            `/comments/${documentId}`,
            {
              params: {
                populate: "*",
              },
            }
          );

          return response.data;
        })
      );

      return {
        data: responses.map((response) => response.data),
        articleDocumentId,
        isLoadMore,
      };
    } catch (error: unknown) {
      return rejectWithValue(error || "Error fetching comments");
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // FETCH BY ID
    builder
      .addCase(fetchCommentByDocumentId.pending, (state) => {
        state.detail.status = "loading";
        state.detail.error = null;
      })
      .addCase(fetchCommentByDocumentId.fulfilled, (state, action) => {
        state.detail.status = "succeeded";
        state.detail.datum = action.payload.data;
      })
      .addCase(fetchCommentByDocumentId.rejected, (state, action) => {
        state.detail.status = "failed";
        state.detail.error = action.payload as string;
      })

      // FETCH DETAILED COMMENT
      .addCase(fetchDetailedComments.pending, (state, action) => {
        const { articleDocumentId } = action.meta.arg;
        if (!state.articleComments[articleDocumentId]) {
          state.articleComments[articleDocumentId] = { data: [], status: "idle", error: null };
        }
        state.articleComments[articleDocumentId].status = "loading";
        state.articleComments[articleDocumentId].error = null;
      })
      .addCase(fetchDetailedComments.fulfilled, (state, action) => {
        const { articleDocumentId, data, isLoadMore } = action.payload;
        state.articleComments[articleDocumentId] = {
          data: isLoadMore ? [...state.articleComments[articleDocumentId].data, ...data] : data,
          status: "succeeded",
          error: null,
        };
      })
      .addCase(fetchDetailedComments.rejected, (state, action) => {
        const { articleDocumentId } = action.meta.arg;
        state.articleComments[articleDocumentId].status = "failed";
        state.articleComments[articleDocumentId].error = action.payload as string;
      });
  },
});

export const commentSliceAction = commentSlice.actions;
const commentReducer = commentSlice.reducer;
export default commentReducer;
