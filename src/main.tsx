import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import TestingPage from "./app/testing/page.tsx";
import MainPage from "./app/index/page.tsx";
import TestingDetailpage from "./app/testing/detail/page.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/testing" element={<TestingPage />} />
        <Route path="/testing/:testingId" element={<TestingDetailpage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
