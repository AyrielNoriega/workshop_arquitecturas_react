/**
 * Puerto de almacenamiento clave-valor.
 * Abstrae localStorage para poder sustituirlo en SSR (memoria) y en tests.
 */
export interface KeyValueStorage {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}
