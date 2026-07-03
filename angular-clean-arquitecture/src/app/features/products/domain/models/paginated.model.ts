/**
 * Página genérica de resultados. Vive en el dominio de products (único consumidor hoy);
 * se promueve a shared cuando una segunda feature pagine.
 */
export interface Paginated<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}
