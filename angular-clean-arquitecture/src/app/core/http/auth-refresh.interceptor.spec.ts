import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { API_BASE_URL } from '../config/api.config';
import { STORAGE } from '../storage/storage.token';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../storage/storage-keys';
import { MemoryStorageService } from '../storage/memory-storage.service';
import { AUTH_SESSION_EXPIRED_HANDLER, AUTH_TOKEN_REFRESHER } from './auth-hooks.token';
import { authRefreshInterceptor } from './auth-refresh.interceptor';
import { authTokenInterceptor } from './auth-token.interceptor';

const BASE_URL = 'https://api.test';

describe('authRefreshInterceptor', () => {
  let httpClient: HttpClient;
  let http: HttpTestingController;
  let storage: MemoryStorageService;
  let refresher: ReturnType<typeof vi.fn>;
  let onSessionExpired: ReturnType<typeof vi.fn>;

  function setup(): void {
    TestBed.configureTestingModule({
      providers: [
        // Mismo orden que en app.config.ts: refresh primero, token después.
        provideHttpClient(withInterceptors([authRefreshInterceptor, authTokenInterceptor])),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
        { provide: STORAGE, useValue: storage },
        { provide: AUTH_TOKEN_REFRESHER, useValue: refresher },
        { provide: AUTH_SESSION_EXPIRED_HANDLER, useValue: onSessionExpired },
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  }

  beforeEach(() => {
    storage = new MemoryStorageService();
    onSessionExpired = vi.fn();
  });

  it('ante un 401 refresca y reintenta con el token nuevo', () => {
    storage.set(ACCESS_TOKEN_KEY, 'viejo');
    storage.set(REFRESH_TOKEN_KEY, 'refresh-1');
    refresher = vi.fn(() =>
      of({ accessToken: 'nuevo', refreshToken: 'refresh-2' }).pipe(
        // Simula la persistencia que hace AuthRepositoryImpl al refrescar.
      ),
    );
    setup();

    let result: unknown;
    httpClient.get(`${BASE_URL}/products`).subscribe((r) => (result = r));

    // Primera request sale con el token viejo y recibe 401.
    const first = http.expectOne(`${BASE_URL}/products`);
    expect(first.request.headers.get('Authorization')).toBe('Bearer viejo');
    storage.set(ACCESS_TOKEN_KEY, 'nuevo'); // efecto lateral del refresh real
    first.flush({}, { status: 401, statusText: 'Unauthorized' });

    // El retry re-pasa por authTokenInterceptor y toma el token NUEVO.
    const retry = http.expectOne(`${BASE_URL}/products`);
    expect(retry.request.headers.get('Authorization')).toBe('Bearer nuevo');
    retry.flush({ ok: true });

    expect(refresher).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ ok: true });
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it('si el refresh falla, notifica sesión expirada y propaga el error', () => {
    storage.set(REFRESH_TOKEN_KEY, 'refresh-1');
    refresher = vi.fn(() => throwError(() => new Error('refresh caído')));
    setup();

    let failed = false;
    httpClient.get(`${BASE_URL}/products`).subscribe({ error: () => (failed = true) });

    http
      .expectOne(`${BASE_URL}/products`)
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(onSessionExpired).toHaveBeenCalledTimes(1);
    expect(failed).toBe(true);
  });

  it('NO intenta refresh si no hay refresh token (usuario anónimo)', () => {
    refresher = vi.fn();
    setup();

    let failed = false;
    httpClient.get(`${BASE_URL}/auth/me`).subscribe({ error: () => (failed = true) });

    http.expectOne(`${BASE_URL}/auth/me`).flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(refresher).not.toHaveBeenCalled();
    expect(failed).toBe(true);
  });

  it('errores que no son 401 pasan de largo', () => {
    storage.set(REFRESH_TOKEN_KEY, 'refresh-1');
    refresher = vi.fn();
    setup();

    let status = 0;
    httpClient.get(`${BASE_URL}/products`).subscribe({
      error: (e: { status: number }) => (status = e.status),
    });

    http
      .expectOne(`${BASE_URL}/products`)
      .flush({}, { status: 500, statusText: 'Server Error' });

    expect(refresher).not.toHaveBeenCalled();
    expect(status).toBe(500);
  });
});
