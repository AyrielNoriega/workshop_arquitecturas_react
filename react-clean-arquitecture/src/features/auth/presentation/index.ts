/**
 * Punto de entrada público de la presentación de la feature de auth. El resto de
 * la app (capa `app/`) consume desde aquí, sin alcanzar la estructura interna.
 */
export { AuthProvider } from "./context/AuthProvider";
export { useAuth } from "./context/useAuth";
export { useSessionValidation } from "./hooks/useSessionValidation";
export { LogoutButton } from "./components/LogoutButton";
export { LoginPage } from "./pages/LoginPage";
export { DashboardPage } from "./pages/DashboardPage";
