import { useState, type FormEvent } from "react";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useLogin } from "../hooks/useLogin";

export function LoginForm() {
  const login = useLogin();
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login.mutate({ username, password });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={2}>
        {login.isError && (
          <Alert severity="error">
            {login.error instanceof Error
              ? login.error.message
              : "No se pudo iniciar sesión"}
          </Alert>
        )}

        <TextField
          label="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          fullWidth
          required
        />
        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          fullWidth
          required
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={login.isPending}
          fullWidth
        >
          {login.isPending ? "Entrando…" : "Iniciar sesión"}
        </Button>
      </Stack>
    </Box>
  );
}
