/** Espejo del usuario que devuelve DummyJSON en /auth/login y /auth/me. */
export interface UserDto {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}
