import {
  AppBar,
  Avatar,
  Box,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import { LogoutButton, useAuth } from "../../features/auth";

/**
 * Layout de las pantallas autenticadas (AppBar + contenido vía <Outlet/>).
 *
 * Vive en la capa `app/` (no en `shared/`) porque conoce la sesión: muestra el
 * usuario y el botón de logout. `shared/` debe permanecer genérico, sin
 * dependencias hacia features.
 */
export function AppLayout() {
  const { user } = useAuth();

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Workshop Arquitecturas React
          </Typography>
          {user && (
            <Stack direction="row" spacing={1.5} sx={{ mr: 2, alignItems: "center" }}>
              <Avatar src={user.image} alt={user.username} sx={{ width: 32, height: 32 }} />
              <Typography variant="body2">
                {user.firstName} {user.lastName}
              </Typography>
            </Stack>
          )}
          <LogoutButton />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
