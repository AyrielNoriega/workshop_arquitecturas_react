import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/useAuth";
import { authService } from "../services/auth.service";

/**
 * Mutación de login. TanStack Query maneja el estado async (isPending, error);
 * en éxito, el resultado se promueve al AuthContext vía `setSession`.
 */
export function useLogin() {
  const { setSession } = useAuth();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (session) => setSession(session),
  });
}
