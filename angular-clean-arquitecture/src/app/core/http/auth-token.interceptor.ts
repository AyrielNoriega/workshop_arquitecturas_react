import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { API_BASE_URL } from '../config/api.config';
import { STORAGE } from '../storage/storage.token';
import { ACCESS_TOKEN_KEY } from '../storage/storage-keys';

const PUBLIC_AUTH_PATHS = ['/auth/login', '/auth/refresh'];

/**
 * Agrega "Authorization: Bearer <token>" a las requests dirigidas a la API.
 * Lee el token directo del STORAGE (no del AuthStore) para mantener el grafo de DI mínimo.
 */
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = inject(API_BASE_URL);
  const storage = inject(STORAGE);

  const isApiRequest = req.url.startsWith(baseUrl);
  const isPublicAuthPath = PUBLIC_AUTH_PATHS.some((path) => req.url.includes(path));
  const token = storage.get(ACCESS_TOKEN_KEY);

  if (!isApiRequest || isPublicAuthPath || !token) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
