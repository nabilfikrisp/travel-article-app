import { configureStore } from "@reduxjs/toolkit";
import articleReducer from "./slices/article/articleSlice";
import authReducer from "./slices/auth/authSlice";

export const store = configureStore({
  reducer: {
    article: articleReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
