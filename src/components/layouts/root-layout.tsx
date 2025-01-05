import { Outlet } from "react-router";
import NavBar from "./nav-bar";

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavBar />
      <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col px-5">
        <Outlet />
      </div>
      <footer>footer</footer>
    </div>
  );
}
