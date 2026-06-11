/**
 * Entidad de dominio: usuario autenticado.
 *
 * Es una estructura de negocio pura, independiente del backend. Los campos son
 * los que la app necesita; el mapeo desde la respuesta cruda de DummyJSON (DTO)
 * ocurre en `infrastructure`, nunca aquí. El dominio no conoce DummyJSON.
 */
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}
