import { UserDto } from './user.dto';

/** Respuesta de POST /auth/login: los datos del usuario + tokens al mismo nivel. */
export interface LoginResponseDto extends UserDto {
  accessToken: string;
  refreshToken: string;
}
