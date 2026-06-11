import { Outlet } from "react-router-dom";
import { useAuth, useSessionValidation } from "../../features/auth";
import { FullPageSpinner } from "../../shared/components/layout/FullPageSpinner";

/**
 * Elemento raíz del router. Monta `useSessionValidation` UNA sola vez para toda
 * la app y bloquea el render con un spinner mientras el estado es `idle`
 * (rehidratando/validando token). Es como el "guard" de sesión global, que se encarga de validar si hay sesión.
 */
export function SessionBoundary() {
  const { status } = useAuth();
  useSessionValidation();

  if (status === "idle") {
    return <FullPageSpinner />;
  }

  return <Outlet />;
}
