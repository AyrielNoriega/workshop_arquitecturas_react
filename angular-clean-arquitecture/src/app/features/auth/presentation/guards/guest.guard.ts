import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStore } from '../store/auth.store';

/** Evita mostrar /login a un usuario que ya tiene sesión. */
export const guestGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  const router = inject(Router);

  if (store.isAuthenticated() || store.hasStoredSession()) {
    return router.createUrlTree(['/products']);
  }
  return true;
};
