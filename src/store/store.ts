import { configureStore } from "@reduxjs/toolkit";
import articleReducer from "./slices/article/articleSlice";
import authReducer from "./slices/auth/authSlice";
import categoryReducer from "./slices/category/categorySlice";
import commentReducer from "./slices/comment/commentSlice";

export const store = configureStore({
  devTools: true,
  reducer: {
    article: articleReducer,
    auth: authReducer,
    category: categoryReducer,
    comment: commentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
