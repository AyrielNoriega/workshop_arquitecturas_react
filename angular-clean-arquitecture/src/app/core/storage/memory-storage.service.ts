import { KeyValueStorage } from './storage.port';

/**
 * Fallback en memoria para SSR: el servidor no tiene localStorage.
 * El primer render es siempre "invitado"; el cliente hidrata la sesión real.
 */
export class MemoryStorageService implements KeyValueStorage {
  private readonly store = new Map<string, string>();

  get(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  set(key: string, value: string): void {
    this.store.set(key, value);
  }

  remove(key: string): void {
    this.store.delete(key);
  }
}
