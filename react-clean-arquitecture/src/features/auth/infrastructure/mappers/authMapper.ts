import type { AuthTokens, Session } from "../../domain/entities/Session";
import type { User } from "../../domain/entities/User";
import type {
  LoginResponseDto,
  RefreshResponseDto,
  UserDto,
} from "../dto/auth.dto";

/**
 * FRONTERA DTO -> entidad de dominio.
 *
 * Este es el único punto donde la forma del backend se traduce a las estructuras
 * que entiende la app. Aislar el mapeo aquí permite que un cambio de API o de
 * proveedor no se propague hacia adentro: el dominio permanece estable.
 */

export const toUser = (dto: UserDto): User => ({
  id: dto.id,
  username: dto.username,
  email: dto.email,
  firstName: dto.firstName,
  lastName: dto.lastName,
  gender: dto.gender,
  image: dto.image,
});

export const toSession = (dto: LoginResponseDto): Session => {
  const { accessToken, refreshToken, ...user } = dto;
  return { user: toUser(user), accessToken, refreshToken };
};

export const toAuthTokens = (dto: RefreshResponseDto): AuthTokens => ({
  accessToken: dto.accessToken,
  refreshToken: dto.refreshToken,
});
