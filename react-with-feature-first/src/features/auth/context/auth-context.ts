import { createContext } from "react";
import type { AuthSession, AuthStatus, User } from "../types/auth.types";

export interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  setSession: (session: AuthSession) => void;
  confirmSession: (user: User) => void;
  clearSession: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
