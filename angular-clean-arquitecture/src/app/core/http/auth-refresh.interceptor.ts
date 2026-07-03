import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, shareReplay, switchMap, throwError } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { STORAGE } from '../storage/storage.token';
import { REFRESH_TOKEN_KEY } from '../storage/storage-keys';
import { AUTH_SESSION_EXPIRED_HANDLER, AUTH_TOKEN_REFRESHER } from './auth-hooks.token';

const AUTH_PATHS = ['/auth/login', '/auth/refresh'];

/** Garantiza un único refresh en vuelo: las requests 401 concurrentes lo comparten. */
@Injectable({ providedIn: 'root' })
export class RefreshCoordinator {
  private readonly refresher = inject(AUTH_TOKEN_REFRESHER);
  private inFlight$: Observable<unknown> | null = null;

  refresh(): Observable<unknown> {
    if (!this.inFlight$) {
      this.inFlight$ = this.refresher().pipe(
        finalize(() => (this.inFlight$ = null)),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    }
    return this.inFlight$;
  }
}

/**
 * Ante un 401 de la API: refresca tokens y reintenta la request original.
 * DEBE registrarse ANTES de authTokenInterceptor en withInterceptors: el retry con next(req)
 * solo re-ejecuta los interceptores posteriores, y así el retry toma el token nuevo.
 * Si el refresh falla, delega la limpieza de sesión al AUTH_SESSION_EXPIRED_HANDLER.
 */
export const authRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const coordinator = inject(RefreshCoordinator);
  const storage = inject(STORAGE);
  const baseUrl = inject(API_BASE_URL);
  const onSessionExpired = inject(AUTH_SESSION_EXPIRED_HANDLER);

  const isApiRequest = req.url.startsWith(baseUrl);
  const isAuthPath = AUTH_PATHS.some((path) => req.url.includes(path));

  return next(req).pipe(
    catchError((error: unknown) => {
      const isUnauthorized = error instanceof HttpErrorResponse && error.status === 401;
      const canRefresh = !!storage.get(REFRESH_TOKEN_KEY);

      if (!isUnauthorized || !isApiRequest || isAuthPath || !canRefresh) {
        return throwError(() => error);
      }

      return coordinator.refresh().pipe(
        switchMap(() => next(req)),
        catchError((refreshError: unknown) => {
          onSessionExpired();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
