import { useCallback, useMemo, useState, type ReactNode } from "react";
import { tokenStorage } from "../../../shared/lib/tokenStorage";
import type { AuthSession, AuthStatus, User } from "../types/auth.types";
import { AuthContext, type AuthContextValue } from "./auth-context";

const USER_KEY = "auth.user";

const readStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

const writeStoredUser = (user: User | null): void => {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
};

interface AuthState {
  user: User | null;
  status: AuthStatus;
}

/**
 * Provee el estado de sesión a toda la app.
 *
 * Al arrancar rehidrata desde localStorage:
 *  - Si hay un access token, el estado parte en `idle`: hay que validar el token
 *    contra /auth/me (lo hace `useSessionValidation` montado más abajo en el árbol)
 *    antes de dar la sesión por buena.
 *  - Si no hay token, partimos en `unauthenticated`.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const hasToken = Boolean(tokenStorage.getAccessToken());
    return {
      user: hasToken ? readStoredUser() : null,
      status: hasToken ? "idle" : "unauthenticated",
    };
  });

  const setSession = useCallback((session: AuthSession) => {
    tokenStorage.setTokens(session.accessToken, session.refreshToken);
    writeStoredUser(session.user);
    setState({ user: session.user, status: "authenticated" });
  }, []);

  const confirmSession = useCallback((user: User) => {
    writeStoredUser(user);
    setState({ user, status: "authenticated" });
  }, []);

  const clearSession = useCallback(() => {
    tokenStorage.clear();
    writeStoredUser(null);
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
