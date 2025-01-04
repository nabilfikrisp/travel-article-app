import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import MainPage from "@/app/index/page.tsx";
import "./index.css";
import ArticlesPage from "./app/articles/page";
import { store } from "./store/store";
import { Provider } from "react-redux";
import RootLayout from "./components/layouts/root-layout";
import Page404 from "./components/Page404";
import CategoriesPage from "./app/categories/page";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/categories" element={<CategoriesPage />} />

            <Route path="*" element={<Page404 />} />
          </Route>

          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
