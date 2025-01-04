import { Outlet } from "react-router";
import NavBar from "./nav-bar";

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavBar />
      <div className="mx-auto h-full w-full max-w-7xl px-5 flex-1">
        <Outlet />
      </div>
      <footer>footer</footer>
    </div>
  );
}
