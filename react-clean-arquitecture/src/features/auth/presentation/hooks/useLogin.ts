import { useMutation } from "@tanstack/react-query";
import { container } from "../../../../core/di/container";
import type { Credentials } from "../../domain/value/Credentials";
import { useAuth } from "../context/useAuth";

/**
 * Mutación de login. TanStack Query gestiona el estado async (isPending, error)
 * envolviendo la EJECUCIÓN del caso de uso (no llama a fetch ni a servicios). En
 * éxito, la sesión se promueve al AuthContext.
 */
export function useLogin() {
  const { setSession } = useAuth();

  return useMutation({
    mutationFn: (credentials: Credentials) =>
      container.loginUseCase.execute(credentials),
    onSuccess: (session) => setSession(session),
  });
}
