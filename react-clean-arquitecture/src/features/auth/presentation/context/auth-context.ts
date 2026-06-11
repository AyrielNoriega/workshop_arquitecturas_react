import { createContext } from "react";
import type { Session } from "../../domain/entities/Session";
import type { User } from "../../domain/entities/User";
import type { AuthStatus } from "../../domain/value/Credentials";

/**
 * Contrato del contexto de sesión. Mantiene SOLO estado de UI (quién está
 * logueado y en qué estado). El estado de servidor (login/me) vive en TanStack
 * Query; la persistencia, en el puerto `SessionStorage`. No se duplican aquí.
 */
export interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  setSession: (session: Session) => void;
  confirmSession: (user: User) => void;
  clearSession: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
