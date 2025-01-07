import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Category, CategoryState } from "./types";
import apiClient from "@/configs/axios-interceptor";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/api-response.type";
import { Pagination } from "@/types/pagination.type";
import { ArticleQueryParams } from "../article/types";

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
  mutation: {
    status: "idle",
    error: null,
  },
};

type fetchCategoriesParams =
  | {
      pageSize?: number;
      page?: number;
    }
  | undefined;

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (params: fetchCategoriesParams = {}, { rejectWithValue }) => {
    const { pageSize = 10, page = 1 } = params;

    try {
      const response = await apiClient.get<ApiResponse<Category[], { pagination: Pagination }>>(
        "/categories",
        {
          params: {
            populate: "*",
            [ArticleQueryParams.PAGE_SIZE]: pageSize,
            [ArticleQueryParams.PAGE]: page,
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

type mutatePostCategoryDto = { name: string };
export const mutatePostCategory = createAsyncThunk(
  "articles/mutatePostCategory",
  async (dto: mutatePostCategoryDto, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<ApiResponse<Category, { pagination: Pagination }>>(
        `/categories/`,
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

export const mutateDeleteCategory = createAsyncThunk(
  "articles/mutateDeleteCategory",
  async (documentId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/categories/${documentId}`, {
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

export const mutatePutCategory = createAsyncThunk(
  "articles/mutatePutCateogry",
  async ({ documentId, name }: { documentId: string; name: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<ApiResponse<Category, { pagination: Pagination }>>(
        `/categories/${documentId}`,
        {
          data: {
            name,
          },
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
      })

      // POST
      .addCase(mutatePostCategory.pending, (state) => {
        state.mutation.error = null;
        state.mutation.status = "loading";
      })
      .addCase(mutatePostCategory.fulfilled, (state, action) => {
        state.categories.data.unshift(action.payload.data);
        state.mutation.status = "succeeded";
      })
      .addCase(mutatePostCategory.rejected, (state, action) => {
        state.mutation.error = action.payload as string;
        state.mutation.status = "failed";
      })

      // delete
      .addCase(mutateDeleteCategory.pending, (state) => {
        state.mutation.error = null;
        state.mutation.status = "loading";
      })
      .addCase(mutateDeleteCategory.fulfilled, (state, action) => {
        state.categories.data = state.categories.data.filter(
          (category) => category.documentId !== action.meta.arg
        );
        state.mutation.status = "succeeded";
      })
      .addCase(mutateDeleteCategory.rejected, (state, action) => {
        state.mutation.error = action.payload as string;
        state.mutation.status = "failed";
      })

      // put
      .addCase(mutatePutCategory.pending, (state) => {
        state.mutation.error = null;
        state.mutation.status = "loading";
      })
      .addCase(mutatePutCategory.fulfilled, (state, action) => {
        state.categories.data = state.categories.data.map((category) => {
          if (category.documentId === action.payload.data.documentId) {
            return action.payload.data;
          }
          return category;
        });
        state.mutation.status = "succeeded";
      })
      .addCase(mutatePutCategory.rejected, (state, action) => {
        state.mutation.error = action.payload as string;
        state.mutation.status = "failed";
      });
  },
});

const categoryReducer = categorySlice.reducer;
export default categoryReducer;
