import { useAppSelector } from "@/store/hooks";
import { Navigate, Outlet } from "react-router";

export default function AuthGuard() {
  const { user } = useAppSelector((state) => state.auth);
  return user ? <Outlet /> : <Navigate to="/auth/login" />;
}
