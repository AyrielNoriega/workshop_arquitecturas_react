import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { AUTH_REPOSITORY } from '../ports/auth.repository';
import { AuthSession } from '../models/auth-session.model';
import { LoginCredentials } from '../models/login-credentials.model';

const DEFAULT_TOKEN_LIFETIME_MINS = 30;

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  private readonly repository = inject(AUTH_REPOSITORY);

  execute(credentials: LoginCredentials): Observable<AuthSession> {
    const username = credentials.username.trim();
    if (!username || !credentials.password) {
      return throwError(() => new Error('Usuario y contraseña son requeridos'));
    }
    return this.repository.login({
      username,
      password: credentials.password,
      expiresInMins: credentials.expiresInMins ?? DEFAULT_TOKEN_LIFETIME_MINS,
    });
  }
}
