import { Container, Paper, Stack, Typography } from "@mui/material";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <Container
      maxWidth="xs"
      sx={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Iniciar sesión
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Demo: usuario <strong>emilys</strong> · contraseña{" "}
              <strong>emilyspass</strong>
            </Typography>
          </Stack>
          <LoginForm />
        </Stack>
      </Paper>
    </Container>
  );
}
