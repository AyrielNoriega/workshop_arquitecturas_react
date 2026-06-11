import type { AuthRepository } from "../domain/ports/AuthRepository";
import type { SessionStorage } from "../domain/ports/SessionStorage";

/**
 * Caso de uso: cerrar sesión.
 *
 * Notifica al backend (no-op si es stateless) y borra la sesión persistida. La
 * limpieza de la caché de servidor (TanStack Query) y del estado de UI es
 * responsabilidad de la capa de presentación, no de este caso de uso.
 */
export class LogoutUseCase {
  private readonly authRepository: AuthRepository;
  private readonly sessionStorage: SessionStorage;

  constructor(authRepository: AuthRepository, sessionStorage: SessionStorage) {
    this.authRepository = authRepository;
    this.sessionStorage = sessionStorage;
  }

  async execute(): Promise<void> {
    await this.authRepository.logout();
    this.sessionStorage.clear();
  }
}
