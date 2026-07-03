import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Hooks que core expone y el composition root (app.config.ts) cablea al feature de auth.
 * Inversión de dependencias: core NO puede importar de features/, así que define estos
 * puertos y la app los enlaza a los use-cases reales.
 */

/** Ejecuta el refresh de tokens (enlazado a RefreshTokenUseCase). */
export const AUTH_TOKEN_REFRESHER = new InjectionToken<() => Observable<unknown>>(
  'AUTH_TOKEN_REFRESHER',
);

/** Se invoca cuando el refresh falla: limpiar sesión + redirigir (enlazado al AuthStore). */
export const AUTH_SESSION_EXPIRED_HANDLER = new InjectionToken<() => void>(
  'AUTH_SESSION_EXPIRED_HANDLER',
);
