import { useAppSelector } from "@/store/hooks";
import { Outlet, useNavigate } from "react-router";

export default function GuestGuard() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  if (user) {
    navigate(-1);
    return null;
  }

  return <Outlet />;
}
