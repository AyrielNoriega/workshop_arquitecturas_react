import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { authService } from "../services/auth.service";

/**
 * Valida la sesión rehidratada al arrancar la app.
 *
 * Se activa solo cuando el estado es `idle` (había un token en localStorage pero
 * aún no lo hemos confirmado). Llama a /auth/me:
 *  - éxito  -> `confirmSession` (idle -> authenticated) con el user fresco.
 *  - error  -> `clearSession`   (idle -> unauthenticated); el httpClient ya
 *              habrá intentado el refresh antes de fallar.
 *
 * Se monta una sola vez, alto en el árbol (en el AppLayout / guard).
 */
export function useSessionValidation() {
  const { status, confirmSession, clearSession } = useAuth();
  const enabled = status === "idle";

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.getMe,
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.isSuccess) confirmSession(query.data);
  }, [query.isSuccess, query.data, confirmSession]);

  useEffect(() => {
    if (query.isError) clearSession();
  }, [query.isError, clearSession]);

  return { isValidating: enabled && query.isPending };
}
