import type { Session } from "../domain/entities/Session";
import type { AuthRepository } from "../domain/ports/AuthRepository";
import type { SessionStorage } from "../domain/ports/SessionStorage";
import type { Credentials } from "../domain/value/Credentials";

/**
 * Caso de uso: iniciar sesión.
 *
 * Orquesta dos puertos del dominio: autentica contra el `AuthRepository` y
 * persiste la sesión resultante con `SessionStorage`. No conoce React, ni
 * TanStack Query, ni fetch, ni localStorage: solo interfaces. Sus colaboradores
 * concretos se inyectan por constructor (DI) → testeable con dobles en memoria.
 */
export class LoginUseCase {
  private readonly authRepository: AuthRepository;
  private readonly sessionStorage: SessionStorage;

  constructor(authRepository: AuthRepository, sessionStorage: SessionStorage) {
    this.authRepository = authRepository;
    this.sessionStorage = sessionStorage;
  }

  async execute(credentials: Credentials): Promise<Session> {
    const session = await this.authRepository.login(credentials);
    this.sessionStorage.save(session);
    return session;
  }
}
