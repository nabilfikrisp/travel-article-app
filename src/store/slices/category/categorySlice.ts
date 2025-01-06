import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Category, CategoryState } from "./types";
import apiClient from "@/configs/axios-interceptor";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/api-response.type";
import { Pagination } from "@/types/pagination.type";

const initialState: CategoryState = {
  categories: {
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
};

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await apiClient.get<ApiResponse<Category[], { pagination: Pagination }>>("/categories");
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || error.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categories.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.status = "succeeded";
        state.categories.data = action.payload.data;
        state.categories.meta = action.payload.meta;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.status = "failed";
        state.categories.error = action.payload as string;
      });
  },
});

const categoryReducer = categorySlice.reducer;
export default categoryReducer;
