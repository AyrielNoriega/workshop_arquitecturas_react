import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { DashboardPage, LoginPage } from "../../features/auth/presentation";
import { AppLayout } from "../layout/AppLayout";
import { paths } from "./paths";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { SessionBoundary } from "./SessionBoundary";

/**
 * Árbol de rutas. `AppRouter` solo ensambla y referencia las páginas (que viven
 * en la feature). El routing es composición de app, no lógica de negocio.
 *
 *   SessionBoundary (valida sesión)
 *   ├─ PublicRoute    -> /login
 *   └─ ProtectedRoute -> AppLayout -> /dashboard
 */
const router = createBrowserRouter([
  {
    element: <SessionBoundary />,
    children: [
      {
        element: <PublicRoute />,
        children: [{ path: paths.LOGIN, element: <LoginPage /> }],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                index: true,
                element: <Navigate to={paths.DASHBOARD} replace />,
              },
              { path: paths.DASHBOARD, element: <DashboardPage /> },
            ],
          },
        ],
      },
      { path: "*", element: <Navigate to={paths.ROOT} replace /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
