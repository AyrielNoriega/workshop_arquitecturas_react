import type { AuthTokens, Session } from "../entities/Session";
import type { User } from "../entities/User";
import type { Credentials } from "../value/Credentials";

/**
 * PUERTO (interfaz) del repositorio de autenticación.
 *
 * Aquí se materializa la inversión de dependencias: la capa `application`
 * (casos de uso) depende de esta abstracción, NO de cómo se habla con el backend.
 * La implementación concreta (`HttpAuthRepository`, en `infrastructure`) se
 * inyecta desde `core/di`. Para los tests basta un doble en memoria que cumpla
 * este contrato, sin tocar red ni React.
 */
export interface AuthRepository {
  login(credentials: Credentials): Promise<Session>;

  getMe(): Promise<User>;

  refresh(refreshToken: string): Promise<AuthTokens>;

  logout(): Promise<void>;
}
