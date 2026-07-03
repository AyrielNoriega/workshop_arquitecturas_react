import { Routes } from '@angular/router';

/** Rutas lazy del feature auth montadas bajo /profile (login se carga directo en app.routes). */
export default [
  {
    path: '',
    loadComponent: () =>
      import('./presentation/pages/profile/profile.page').then((m) => m.ProfilePage),
  },
] satisfies Routes;
