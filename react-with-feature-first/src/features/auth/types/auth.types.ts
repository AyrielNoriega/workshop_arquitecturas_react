/** Usuario autenticado (campos relevantes de DummyJSON). */
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export interface Credentials {
  username: string;
  password: string;
}

/** Sesión activa: el usuario + sus tokens. Es lo que el contexto mantiene. */
export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/**
 * Estado de la sesión:
 *  - `idle`: aún no sabemos (rehidratando/validando token al arrancar).
 *  - `authenticated`: hay sesión válida.
 *  - `unauthenticated`: no hay sesión.
 */
export type AuthStatus = "idle" | "authenticated" | "unauthenticated";

/** Forma cruda de la respuesta de `POST /auth/login` en DummyJSON. */
export interface LoginResponse extends User {
  accessToken: string;
  refreshToken: string;
}
