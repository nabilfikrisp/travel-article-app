import { Link, NavLink } from "react-router";
import Logo from "../logo";
import { Button } from "../ui/button";
import { useAppSelector } from "@/store/hooks";
import ProfileDropdown from "../profile-dropdown";
import { ToggleTheme } from "../toggle-theme";
import { cn } from "@/lib/utils";

export default function NavBar() {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <nav className="sticky top-0 z-10 flex h-[70px] w-full border-b bg-background shadow-lg">
      <div className="m-auto flex w-full max-w-7xl items-center gap-1 sm:gap-4 px-5 font-semibold">
        <Logo />
        <NavLink
          to="/articles"
          className={({ isActive }) => cn(isActive ? "text-primary" : "", "hover:text-primary/80")}
        >
          Articles
        </NavLink>
        {/* <NavLink to="/categories" className={({ isActive }) => (isActive ? "text-primary" : "")}>
          Categories
        </NavLink> */}
        <ToggleTheme />
        {user ? (
          <ProfileDropdown user={user} />
        ) : (
          <Button asChild>
            <Link to="/auth/login" className="font-semibold">
              Login
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
