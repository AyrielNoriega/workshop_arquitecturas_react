import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';

import { AuthStore } from '../store/auth.store';
import { authGuard } from './auth.guard';

function runGuard(url = '/profile'): boolean | UrlTree {
  const state = { url } as RouterStateSnapshot;
  return TestBed.runInInjectionContext(() =>
    authGuard({} as ActivatedRouteSnapshot, state),
  ) as boolean | UrlTree;
}

function fakeStore(overrides: { authenticated?: boolean; stored?: boolean }): Partial<AuthStore> {
  return {
    isAuthenticated: (() => overrides.authenticated ?? false) as AuthStore['isAuthenticated'],
    hasStoredSession: () => overrides.stored ?? false,
  };
}

describe('authGuard', () => {
  function setup(store: Partial<AuthStore>): void {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthStore, useValue: store }],
    });
  }

  it('permite el paso con sesión activa', () => {
    setup(fakeStore({ authenticated: true }));
    expect(runGuard()).toBe(true);
  });

  it('permite el paso con sesión persistida aunque /auth/me no haya respondido aún', () => {
    setup(fakeStore({ stored: true }));
    expect(runGuard()).toBe(true);
  });

  it('sin sesión redirige a /login preservando returnUrl', () => {
    setup(fakeStore({}));
    const result = runGuard('/profile');
    expect(result).toBeInstanceOf(UrlTree);
    expect(result.toString()).toBe('/login?returnUrl=%2Fprofile');
  });
});
