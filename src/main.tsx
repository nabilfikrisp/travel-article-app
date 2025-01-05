import { StrictMode } from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import { store } from "./store/store";
import RootLayout from "./components/layouts/root-layout";
import Page404 from "./components/Page404";
import ArticlesPage from "./app/articles/page";
import MainPage from "./app/index/page.tsx";
import RegisterPage from "./app/auth/register/page";
import LoginPage from "./app/auth/login/page";
import { Toaster } from "./components/ui/toaster.tsx";
import AuthGuard from "./app/route-guards/auth-guard.tsx";
import GuestGuard from "./app/route-guards/guest-guard.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route index element={<MainPage />} />
              <Route path="articles" element={<ArticlesPage />} />

              <Route element={<AuthGuard />}>
                <Route path="dashboard" element={<>dashboard</>} />
              </Route>

              <Route path="auth" element={<GuestGuard />}>
                <Route path="register" element={<RegisterPage />} />
                <Route path="login" element={<LoginPage />} />
              </Route>

              <Route path="*" element={<Page404 />} />
            </Route>

            <Route path="*" element={<Page404 />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
