import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { container } from "../../../../core/di/container";
import { useAuth } from "../context/useAuth";

/**
 * Valida la sesión rehidratada al arrancar la app. Se monta una sola vez, alto en
 * el árbol (SessionBoundary).
 *
 * Se activa solo cuando el estado es `idle` (había sesión persistida sin validar).
 * Ejecuta `ValidateSessionUseCase` (llama a /auth/me):
 *  - éxito -> `confirmSession` (idle -> authenticated) con el usuario fresco.
 *  - error -> ejecuta logout (borra la sesión persistida) + `clearSession`
 *             (idle -> unauthenticated). El cliente HTTP ya intentó el refresh
 *             antes de fallar.
 */
export function useSessionValidation() {
  const { status, confirmSession, clearSession } = useAuth();
  const enabled = status === "idle";

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => container.validateSessionUseCase.execute(),
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.isSuccess) confirmSession(query.data);
  }, [query.isSuccess, query.data, confirmSession]);

  useEffect(() => {
    if (query.isError) {
      void container.logoutUseCase.execute();
      clearSession();
    }
  }, [query.isError, clearSession]);

  return { isValidating: enabled && query.isPending };
}
