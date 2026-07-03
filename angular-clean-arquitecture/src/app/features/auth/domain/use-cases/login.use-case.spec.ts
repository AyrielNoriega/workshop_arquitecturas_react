import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';

import { AUTH_REPOSITORY, AuthRepository } from '../ports/auth.repository';
import { AuthSession } from '../models/auth-session.model';
import { LoginCredentials } from '../models/login-credentials.model';
import { LoginUseCase } from './login.use-case';

const session: AuthSession = {
  accessToken: 'a',
  refreshToken: 'r',
  user: {
    id: 1,
    username: 'emilys',
    email: 'e@x.com',
    firstName: 'Emily',
    lastName: 'Johnson',
    gender: 'female',
    image: 'img',
  },
};

describe('LoginUseCase', () => {
  let received: LoginCredentials | null;
  let useCase: LoginUseCase;

  beforeEach(() => {
    received = null;
    const fakeRepository: Partial<AuthRepository> = {
      login: (credentials) => {
        received = credentials;
        return of(session);
      },
    };
    TestBed.configureTestingModule({
      providers: [{ provide: AUTH_REPOSITORY, useValue: fakeRepository }],
    });
    useCase = TestBed.inject(LoginUseCase);
  });

  it('rechaza credenciales vacías sin tocar el repositorio', async () => {
    await expect(
      firstValueFrom(useCase.execute({ username: '   ', password: 'x' })),
    ).rejects.toThrow('Usuario y contraseña son requeridos');
    expect(received).toBeNull();
  });

  it('normaliza el username y aplica el tiempo de vida por defecto', async () => {
    const result = await firstValueFrom(
      useCase.execute({ username: '  emilys  ', password: 'emilyspass' }),
    );
    expect(result).toEqual(session);
    expect(received).toEqual({
      username: 'emilys',
      password: 'emilyspass',
      expiresInMins: 30,
    });
  });

  it('respeta un expiresInMins explícito', async () => {
    await firstValueFrom(
      useCase.execute({ username: 'emilys', password: 'emilyspass', expiresInMins: 5 }),
    );
    expect(received?.expiresInMins).toBe(5);
  });
});
