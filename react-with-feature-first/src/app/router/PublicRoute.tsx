import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth";
import { paths } from "./paths";

/**
 * Guard de rutas públicas (login): si ya hay sesión, no tiene sentido mostrar el
 * login -> redirige al dashboard.
 */
export function PublicRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={paths.DASHBOARD} replace />;
  }

  return <Outlet />;
}
