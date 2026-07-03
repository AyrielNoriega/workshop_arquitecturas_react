import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { API_BASE_URL } from '@core/config/api.config';
import { STORAGE } from '@core/storage/storage.token';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@core/storage/storage-keys';
import { MemoryStorageService } from '@core/storage/memory-storage.service';

import { AuthRepositoryImpl } from './auth.repository.impl';

const BASE_URL = 'https://api.test';

describe('AuthRepositoryImpl', () => {
  let repository: AuthRepositoryImpl;
  let http: HttpTestingController;
  let storage: MemoryStorageService;

  beforeEach(() => {
    storage = new MemoryStorageService();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthRepositoryImpl,
        { provide: API_BASE_URL, useValue: BASE_URL },
        { provide: STORAGE, useValue: storage },
      ],
    });
    repository = TestBed.inject(AuthRepositoryImpl);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('login hace POST /auth/login, mapea a AuthSession y persiste tokens', async () => {
    const pending = firstValueFrom(
      repository.login({ username: 'emilys', password: 'emilyspass', expiresInMins: 30 }),
    );

    const req = http.expectOne(`${BASE_URL}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'emilys',
      password: 'emilyspass',
      expiresInMins: 30,
    });
    req.flush({
      id: 1,
      username: 'emilys',
      email: 'e@x.com',
      firstName: 'Emily',
      lastName: 'Johnson',
      gender: 'female',
      image: 'img',
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
    });

    const session = await pending;
    expect(session.user.firstName).toBe('Emily');
    expect(storage.get(ACCESS_TOKEN_KEY)).toBe('access-1');
    expect(storage.get(REFRESH_TOKEN_KEY)).toBe('refresh-1');
  });

  it('refreshToken envía el refresh token guardado y persiste el par nuevo', async () => {
    storage.set(REFRESH_TOKEN_KEY, 'refresh-old');

    const pending = firstValueFrom(repository.refreshToken());

    const req = http.expectOne(`${BASE_URL}/auth/refresh`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ refreshToken: 'refresh-old' });
    req.flush({ accessToken: 'access-new', refreshToken: 'refresh-new' });

    await pending;
    expect(storage.get(ACCESS_TOKEN_KEY)).toBe('access-new');
    expect(storage.get(REFRESH_TOKEN_KEY)).toBe('refresh-new');
  });

  it('logout limpia los tokens persistidos', () => {
    storage.set(ACCESS_TOKEN_KEY, 'a');
    storage.set(REFRESH_TOKEN_KEY, 'r');
    repository.logout();
    expect(storage.get(ACCESS_TOKEN_KEY)).toBeNull();
    expect(storage.get(REFRESH_TOKEN_KEY)).toBeNull();
  });
});
