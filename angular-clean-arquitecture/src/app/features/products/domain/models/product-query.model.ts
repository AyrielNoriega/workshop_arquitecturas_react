/**
 * Parámetros de consulta del listado.
 * q y category son mutuamente excluyentes: DummyJSON no soporta buscar dentro de una categoría.
 */
export interface ProductQuery {
  limit: number;
  skip: number;
  q?: string;
  category?: string;
}
