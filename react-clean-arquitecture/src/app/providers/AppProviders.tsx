import { CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider } from "../../features/auth/presentation";
import { theme } from "../theme/theme";
import { AppRouter } from "../router/AppRouter";
import { QueryProvider } from "./QueryProvider";

/**
 * Composición raíz de la app. Orden de los providers (de fuera hacia dentro):
 *
 *   QueryProvider   -> cache/estado de servidor para todos los hooks
 *   ThemeProvider   -> tema MUI + CssBaseline (reset)
 *   AuthProvider    -> estado de sesión para guards y páginas
 *   AppRouter       -> RouterProvider con el árbol de rutas
 */
export function AppProviders() {
  return (
    <QueryProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
