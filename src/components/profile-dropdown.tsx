import { ChevronDownIcon, LayoutDashboardIcon, LogOutIcon, UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAppDispatch } from "@/store/hooks";
import { User } from "@/store/slices/auth/types";
import { authSliceActions } from "@/store/slices/auth/authSlice";
import { Link } from "react-router";

type ProfileDropdownProps = {
  user: User;
};

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const dispatch = useAppDispatch();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex">
        Account{" "}
        <ChevronDownIcon className="ml-1 transition-all group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="top-10">
        <DropdownMenuLabel>Hi, {user.username}!</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon />
          <Link to="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:cursor-pointer">
          <LayoutDashboardIcon />
          <Link to="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => dispatch(authSliceActions.logout())}
          className="hover:cursor-pointer"
        >
          <LogOutIcon />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
