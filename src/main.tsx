import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import MainPage from "@/app/index/page.tsx";
import "./index.css";
import ArticlesPage from "./app/articles/page";
import { store } from "./store/store";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
