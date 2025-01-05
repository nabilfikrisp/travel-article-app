import { useAppSelector } from "@/store/hooks";
import { Navigate, Outlet } from "react-router";

export default function GuestGuard() {
  const { user } = useAppSelector((state) => state.auth);
  return user ? <Navigate to="/" /> : <Outlet />;
}
