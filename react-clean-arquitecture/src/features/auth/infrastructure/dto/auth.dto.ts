/**
 * DTOs: la forma CRUDA de las respuestas de DummyJSON.
 *
 * Estos tipos NO salen de la capa `infrastructure`. Hacia el dominio solo viajan
 * entidades (`User`, `Session`, `AuthTokens`), tras el mapeo en `authMapper`. Si
 * DummyJSON cambia su contrato, el impacto queda contenido aquí.
 */

/** Usuario tal y como lo devuelve DummyJSON (incluye campos que no usamos). */
export interface UserDto {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export interface LoginResponseDto extends UserDto {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponseDto {
  accessToken: string;
  refreshToken: string;
}
