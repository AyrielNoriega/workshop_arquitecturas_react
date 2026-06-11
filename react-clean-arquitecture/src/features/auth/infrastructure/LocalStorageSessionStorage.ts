import type { Session } from "../domain/entities/Session";
import type { SessionStorage } from "../domain/ports/SessionStorage";

const SESSION_KEY = "auth.session";

/**
 * ADAPTER: implementación del puerto `SessionStorage` sobre `localStorage`.
 *
 * Persiste la sesión completa (usuario + tokens) bajo una sola clave. Es el único
 * archivo que sabe que la persistencia es `localStorage`; cambiarla por cookies o
 * memoria solo afecta aquí. El try/catch protege ante JSON corrupto o storage
 * deshabilitado (modo privado), degradando a "sin sesión".
 */
export class LocalStorageSessionStorage implements SessionStorage {
  load(): Session | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  }

  save(session: Session): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  clear(): void {
    localStorage.removeItem(SESSION_KEY);
  }
}
