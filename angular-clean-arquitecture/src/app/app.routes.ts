import { Routes } from '@angular/router';

import { authGuard } from '@features/auth/presentation/guards/auth.guard';
import { guestGuard } from '@features/auth/presentation/guards/guest.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('@features/auth/presentation/pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'products',
    loadChildren: () => import('@features/products/products.routes'),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadChildren: () => import('@features/auth/auth.routes'),
  },
  { path: '**', redirectTo: 'products' },
];
