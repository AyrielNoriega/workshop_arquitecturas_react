/** Body de POST /auth/login en DummyJSON. */
export interface LoginRequestDto {
  username: string;
  password: string;
  expiresInMins?: number;
}
