import { Link, NavLink } from "react-router";
import Logo from "../logo";
import { Button } from "../ui/button";

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-10 flex h-[70px] w-full border-b bg-background shadow-lg">
      <div className="m-auto flex w-full max-w-7xl items-center gap-4 px-5 font-semibold">
        <Logo />
        <NavLink to="/articles" className={({ isActive }) => (isActive ? "text-primary" : "")}>
          Articles
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => (isActive ? "text-primary" : "")}>
          Categories
        </NavLink>
        <Button asChild>
          <Link to="/login" className="font-semibold">Login</Link>
        </Button>
      </div>
    </nav>
  );
}
