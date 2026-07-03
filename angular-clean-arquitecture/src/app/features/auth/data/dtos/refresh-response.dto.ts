/** Respuesta de POST /auth/refresh — solo tokens, sin usuario. */
export interface RefreshResponseDto {
  accessToken: string;
  refreshToken: string;
}
