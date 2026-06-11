import type { HttpClient } from "../../../core/http/HttpClient";
import type { AuthTokens, Session } from "../domain/entities/Session";
import type { User } from "../domain/entities/User";
import type { AuthRepository } from "../domain/ports/AuthRepository";
import type { Credentials } from "../domain/value/Credentials";
import type {
  LoginResponseDto,
  RefreshResponseDto,
  UserDto,
} from "./dto/auth.dto";
import { toAuthTokens, toSession, toUser } from "./mappers/authMapper";

/**
 * ADAPTER: implementación del puerto `AuthRepository` contra DummyJSON.
 *
 * Único lugar que conoce los endpoints y mapea DTO -> entidad. Recibe el
 * `HttpClient` por constructor (DI) en vez de importar un singleton, lo que lo
 * mantiene desacoplado y sustituible. `login` y `refresh` usan `skipAuthRefresh`
 * para no disparar el ciclo de refresh-on-401 sobre sí mismos.
 */
export class HttpAuthRepository implements AuthRepository {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async login(credentials: Credentials): Promise<Session> {
    const dto = await this.http.post<LoginResponseDto>(
      "/auth/login",
      { ...credentials, expiresInMins: 30 },
      { skipAuthRefresh: true },
    );
    return toSession(dto);
  }

  async getMe(): Promise<User> {
    const dto = await this.http.get<UserDto>("/auth/me");
    return toUser(dto);
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const dto = await this.http.post<RefreshResponseDto>(
      "/auth/refresh",
      { refreshToken, expiresInMins: 30 },
      { skipAuthRefresh: true },
    );
    return toAuthTokens(dto);
  }

  /**
   * DummyJSON no expone logout (JWT stateless): el borrado de la sesión lo hace
   * el `LogoutUseCase` vía `SessionStorage`. Se mantiene async por contrato.
   */
  async logout(): Promise<void> {
    return Promise.resolve();
  }
}
