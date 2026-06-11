import type { Session } from "../entities/Session";

/**
 * PUERTO (interfaz) de persistencia de la sesión.
 *
 * El dominio define QUÉ se necesita (guardar/leer/borrar una sesión), no CÓMO.
 * El "cómo" (localStorage, sessionStorage, cookies, memoria...) vive en
 * `infrastructure` y se inyecta. Gracias a esto los casos de uso orquestan la
 * persistencia sin conocer el navegador, y son testeables con un doble en memoria.
 */
export interface SessionStorage {
  load(): Session | null;

  save(session: Session): void;

  clear(): void;
}
