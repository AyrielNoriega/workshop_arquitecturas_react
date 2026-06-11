import { httpClient } from "../../../shared/api/httpClient";
import type {
  AuthSession,
  Credentials,
  LoginResponse,
  User,
} from "../types/auth.types";

/**
 * Capa de servicios de autenticación: ÚNICO lugar que conoce los endpoints y la
 * forma de las respuestas del backend (DummyJSON). El resto de la feature
 * (hooks, contexto, UI) trabaja con los tipos del dominio (`AuthSession`, `User`).
 *
 * Si cambia el backend, solo se toca este archivo.
 */
export const authService = {
  async login(credentials: Credentials): Promise<AuthSession> {
    const data = await httpClient.post<LoginResponse>(
      "/auth/login",
      { ...credentials, expiresInMins: 30 },
      { skipAuthRefresh: true },
    );

    const { accessToken, refreshToken, ...user } = data;
    return { user, accessToken, refreshToken };
  },

  getMe(): Promise<User> {
    return httpClient.get<User>("/auth/me");
  },

  /**
   * DummyJSON no expone un endpoint de logout (los JWT son stateless). El borrado
   * de tokens/sesión lo hace el hook `useLogout` en cliente. Se deja async para
   * mantener la forma del contrato y facilitar el cambio a un backend con logout.
   */
  async logout(): Promise<void> {
    return Promise.resolve();
  },
} as const;
