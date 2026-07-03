import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStore } from '../store/auth.store';

/**
 * Protege rutas que requieren sesión.
 * Acepta también sesión persistida (token en storage) para no expulsar al usuario
 * durante un reload de página mientras /auth/me aún no responde.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const store = inject(AuthStore);
  const router = inject(Router);

  if (store.isAuthenticated() || store.hasStoredSession()) {
    return true;
  }
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
