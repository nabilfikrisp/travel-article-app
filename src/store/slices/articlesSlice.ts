import apiClient from "@/configs/axios-interceptor";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Articles, ArticlesState } from "./types";
import { ApiResponse } from "@/types/api-response.type";

const initialState: ArticlesState = {
  data: [],
  status: "idle",
  error: null,
};

export const fetchArticles = createAsyncThunk("data/fetchData", async () => {
  const response = await apiClient.get<ApiResponse<Articles[]>>("/articles");
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
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

const articlesReducer = articlesSlice.reducer;
export default articlesReducer;
