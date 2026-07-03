export interface LoginCredentials {
  username: string;
  password: string;
  /** Minutos de vida del access token (default del caso de uso: 30). */
  expiresInMins?: number;
}
