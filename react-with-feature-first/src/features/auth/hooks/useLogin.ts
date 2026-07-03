import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/useAuth";
import { authService } from "../services/auth.service";
import { useState, type FormEvent } from "react";

/**
 * Mutación de login. TanStack Query maneja el estado async (isPending, error);
 * en éxito, el resultado se promueve al AuthContext vía `setSession`.
 */
export function useLogin() {
  const { setSession } = useAuth();

  const login = useMutation({
    mutationFn: authService.login,
    onSuccess: (session) => setSession(session),
  });

  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login.mutate({ username, password });
  };

  return { login, username, setUsername, password, setPassword, handleSubmit };
}
