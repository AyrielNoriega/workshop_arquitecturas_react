import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { environment } from '@env/environment';
import { API_BASE_URL } from '@core/config/api.config';
import { AUTH_SESSION_EXPIRED_HANDLER, AUTH_TOKEN_REFRESHER } from '@core/http/auth-hooks.token';
import { authRefreshInterceptor } from '@core/http/auth-refresh.interceptor';
import { authTokenInterceptor } from '@core/http/auth-token.interceptor';
import { provideStorage } from '@core/providers/provide-storage';
import { AUTH_REPOSITORY } from '@features/auth/domain/ports/auth.repository';
import { RefreshTokenUseCase } from '@features/auth/domain/use-cases/refresh-token.use-case';
import { AuthRepositoryImpl } from '@features/auth/data/repositories/auth.repository.impl';
import { AuthStore } from '@features/auth/presentation/store/auth.store';

import { routes } from './app.routes';

/**
 * Composition root: único lugar (junto con las rutas de feature) donde se enlazan
 * los puertos del dominio con sus implementaciones y se cablean los hooks de core.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    // Orden de interceptores: refresh PRIMERO, para que su retry re-pase por el de token.
    provideHttpClient(withFetch(), withInterceptors([authRefreshInterceptor, authTokenInterceptor])),
    provideStorage(),
    { provide: API_BASE_URL, useValue: environment.apiUrl },
    // Auth se enlaza en root: los interceptores y el bootstrap lo necesitan temprano.
    { provide: AUTH_REPOSITORY, useClass: AuthRepositoryImpl },
    // Hooks de core ← feature auth (core no puede importar features; se cablea aquí).
    {
      provide: AUTH_TOKEN_REFRESHER,
      useFactory: () => {
        const refreshToken = inject(RefreshTokenUseCase);
        return () => refreshToken.execute();
      },
    },
    {
      provide: AUTH_SESSION_EXPIRED_HANDLER,
      useFactory: () => {
        const store = inject(AuthStore);
        return () => store.onSessionExpired();
      },
    },
  ],
};
