import { useCallback, useMemo, useState, type ReactNode } from "react";
import { container } from "../../../../core/di/container";
import type { Session } from "../../domain/entities/Session";
import type { User } from "../../domain/entities/User";
import type { AuthStatus } from "../../domain/value/Credentials";
import { AuthContext, type AuthContextValue } from "./auth-context";

interface AuthState {
  user: User | null;
  status: AuthStatus;
}

/**
 * Provee el estado de sesión a toda la app (capa de presentación).
 *
 * En el arranque hidrata leyendo el puerto `SessionStorage` (a través del
 * contenedor de DI), sin conocer localStorage:
 *  - Si hay sesión persistida, parte en `idle`: hay un usuario tentativo pero el
 *    token debe validarse contra /auth/me (lo hace `useSessionValidation`).
 *  - Si no, parte en `unauthenticated`.
 *
 * Las acciones aquí solo mutan estado en memoria; la PERSISTENCIA ya la realizan
 * los casos de uso (Login/Validate/Logout). Así no se duplica responsabilidad.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const session = container.sessionStorage.load();
    return {
      user: session?.user ?? null,
      status: session ? "idle" : "unauthenticated",
    };
  });

  const setSession = useCallback((session: Session) => {
    setState({ user: session.user, status: "authenticated" });
  }, []);

  const confirmSession = useCallback((user: User) => {
    setState({ user, status: "authenticated" });
  }, []);

  const clearSession = useCallback(() => {
    setState({ user: null, status: "unauthenticated" });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      status: state.status,
      isAuthenticated: state.status === "authenticated",
      setSession,
      confirmSession,
      clearSession,
    }),
    [state, setSession, confirmSession, clearSession],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
