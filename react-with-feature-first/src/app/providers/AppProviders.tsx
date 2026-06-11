import { CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider } from "../../features/auth";
import { theme } from "../theme/theme";
import { AppRouter } from "../router/AppRouter";
import { QueryProvider } from "./QueryProvider";

/**
 * Composición raíz de la app. Orden de los providers (de fuera hacia dentro):
 *
 *   QueryProvider   -> cache/estado de servidor disponible para todos los hooks
 *   ThemeProvider   -> tema MUI + CssBaseline (reset de estilos)
 *   AuthProvider    -> estado de sesión disponible para guards y páginas
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
