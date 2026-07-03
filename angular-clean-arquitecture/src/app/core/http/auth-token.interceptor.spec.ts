import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_BASE_URL } from '../config/api.config';
import { STORAGE } from '../storage/storage.token';
import { ACCESS_TOKEN_KEY } from '../storage/storage-keys';
import { MemoryStorageService } from '../storage/memory-storage.service';
import { authTokenInterceptor } from './auth-token.interceptor';

const BASE_URL = 'https://api.test';

describe('authTokenInterceptor', () => {
  let httpClient: HttpClient;
  let http: HttpTestingController;
  let storage: MemoryStorageService;

  beforeEach(() => {
    storage = new MemoryStorageService();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authTokenInterceptor])),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
        { provide: STORAGE, useValue: storage },
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('agrega el Bearer a requests de la API cuando hay token', () => {
    storage.set(ACCESS_TOKEN_KEY, 'token-123');
    httpClient.get(`${BASE_URL}/auth/me`).subscribe();

    const req = http.expectOne(`${BASE_URL}/auth/me`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-123');
    req.flush({});
  });

  it('NO agrega el header si no hay token', () => {
    httpClient.get(`${BASE_URL}/products`).subscribe();

    const req = http.expectOne(`${BASE_URL}/products`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('NO agrega el header en /auth/login ni /auth/refresh', () => {
    storage.set(ACCESS_TOKEN_KEY, 'token-123');
    httpClient.post(`${BASE_URL}/auth/login`, {}).subscribe();
    httpClient.post(`${BASE_URL}/auth/refresh`, {}).subscribe();

    for (const url of [`${BASE_URL}/auth/login`, `${BASE_URL}/auth/refresh`]) {
      const req = http.expectOne(url);
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({});
    }
  });

  it('NO agrega el header a requests fuera de la API', () => {
    storage.set(ACCESS_TOKEN_KEY, 'token-123');
    httpClient.get('https://otro-servidor.com/x').subscribe();

    const req = http.expectOne('https://otro-servidor.com/x');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
