import type { User } from "../domain/entities/User";
import type { AuthRepository } from "../domain/ports/AuthRepository";
import type { SessionStorage } from "../domain/ports/SessionStorage";

/**
 * Caso de uso: validar/rehidratar la sesión al arrancar.
 *
 * Pide el usuario actual al backend (`getMe`) usando el access token vigente. Si
 * responde, refresca el usuario persistido (manteniendo los tokens) y lo devuelve.
 * Si el token es inválido, `getMe` lanza y el error se propaga al llamador, que
 * decidirá cerrar la sesión. El refresh-on-401 ya lo intentó el cliente HTTP por
 * debajo antes de fallar.
 */
export class ValidateSessionUseCase {
  private readonly authRepository: AuthRepository;
  private readonly sessionStorage: SessionStorage;

  constructor(authRepository: AuthRepository, sessionStorage: SessionStorage) {
    this.authRepository = authRepository;
    this.sessionStorage = sessionStorage;
  }

  async execute(): Promise<User> {
    const user = await this.authRepository.getMe();
    const current = this.sessionStorage.load();
    if (current) {
      this.sessionStorage.save({ ...current, user });
    }
    return user;
  }
}
