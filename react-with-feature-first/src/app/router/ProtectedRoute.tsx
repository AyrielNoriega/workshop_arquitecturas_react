import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth";
import { paths } from "./paths";

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={paths.LOGIN} replace />;
  }

  return <Outlet />;
}
