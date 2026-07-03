import { KeyValueStorage } from './storage.port';

/**
 * Implementación con localStorage (solo browser).
 * Sin providedIn: 'root' — se instancia únicamente vía provideStorage().
 */
export class BrowserStorageService implements KeyValueStorage {
  get(key: string): string | null {
    return localStorage.getItem(key);
  }

  set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
