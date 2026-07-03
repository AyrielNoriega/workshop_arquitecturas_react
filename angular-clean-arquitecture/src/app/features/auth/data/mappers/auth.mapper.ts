import { AuthSession } from '../../domain/models/auth-session.model';
import { TokenPair } from '../../domain/models/token-pair.model';
import { User } from '../../domain/models/user.model';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { RefreshResponseDto } from '../dtos/refresh-response.dto';
import { UserDto } from '../dtos/user.dto';

export function toUser(dto: UserDto): User {
  return {
    id: dto.id,
    username: dto.username,
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName,
    gender: dto.gender,
    image: dto.image,
  };
}

export function toTokenPair(dto: RefreshResponseDto): TokenPair {
  return {
    accessToken: dto.accessToken,
    refreshToken: dto.refreshToken,
  };
}

export function toAuthSession(dto: LoginResponseDto): AuthSession {
  return {
    ...toTokenPair(dto),
    user: toUser(dto),
  };
}
