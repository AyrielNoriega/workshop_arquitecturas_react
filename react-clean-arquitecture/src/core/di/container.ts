import { env } from "../config/env";
import { HttpClient } from "../http/HttpClient";
import { LoginUseCase } from "../../features/auth/application/LoginUseCase";
import { LogoutUseCase } from "../../features/auth/application/LogoutUseCase";
import { ValidateSessionUseCase } from "../../features/auth/application/ValidateSessionUseCase";
import { HttpAuthRepository } from "../../features/auth/infrastructure/HttpAuthRepository";
import { LocalStorageSessionStorage } from "../../features/auth/infrastructure/LocalStorageSessionStorage";

/**
 * COMPOSITION ROOT (inyección de dependencias).
 *
 * Es el ÚNICO lugar donde se conocen e instancian las implementaciones concretas
 * y se conectan a las abstracciones. Aquí se materializa la inversión de
 * dependencias: los casos de uso reciben `AuthRepository` y `SessionStorage` sin
 * saber que por debajo hay HTTP y localStorage. Para un test bastaría con
 * construir los use cases con dobles en memoria, sin tocar este archivo.
 */

const sessionStorage = new LocalStorageSessionStorage();

// El HttpClient es genérico: se le INYECTA cómo obtener el token y cómo refrescar.
// El refresh-on-401 se cablea aquí, no en el cliente: el cliente no conoce auth.
const httpClient = new HttpClient({
  baseUrl: env.API_URL,
  getAccessToken: () => sessionStorage.load()?.accessToken ?? null,
  onUnauthorized: async () => {
    const current = sessionStorage.load();
    if (!current?.refreshToken) return false;
    try {
      const tokens = await authRepository.refresh(current.refreshToken);
      sessionStorage.save({ ...current, ...tokens });
      return true;
    } catch {
      sessionStorage.clear();
      return false;
    }
  },
});

// `authRepository` se referencia (de forma diferida) dentro del closure de
// `onUnauthorized`; en tiempo de ejecución ya está inicializado, así que no hay TDZ.
const authRepository = new HttpAuthRepository(httpClient);

export const container = {
  loginUseCase: new LoginUseCase(authRepository, sessionStorage),
  validateSessionUseCase: new ValidateSessionUseCase(
    authRepository,
    sessionStorage,
  ),
  logoutUseCase: new LogoutUseCase(authRepository, sessionStorage),
  /** Expuesto solo para la hidratación inicial del AuthProvider (lectura del puerto). */
  sessionStorage,
} as const;
