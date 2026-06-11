import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/presentation";
import { paths } from "./paths";

/** Guard de rutas protegidas: sin sesión, redirige al login. */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={paths.LOGIN} replace />;
  }

  return <Outlet />;
}
