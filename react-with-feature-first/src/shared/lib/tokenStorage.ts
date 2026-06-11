/**
 * Persistencia neutra de los tokens de sesión en localStorage.
 *
 * Vive en `shared/` (no en la feature de auth) porque el `httpClient` necesita
 * leer/escribir tokens y NO debe depender de una feature: la dependencia siempre
 * apunta hacia abajo (feature -> shared), nunca al revés.
 */
const ACCESS_TOKEN_KEY = "auth.accessToken";
const REFRESH_TOKEN_KEY = "auth.refreshToken";

export const tokenStorage = {
  getAccessToken: (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),

  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clear: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
} as const;
