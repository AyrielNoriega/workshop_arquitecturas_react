import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthSession } from '../models/auth-session.model';
import { LoginCredentials } from '../models/login-credentials.model';
import { TokenPair } from '../models/token-pair.model';
import { User } from '../models/user.model';

/**
 * Puerto del repositorio de autenticación.
 * La capa data lo implementa; el dominio y la presentación solo conocen esta interface.
 * La implementación es responsable de persistir/limpiar los tokens.
 */
export interface AuthRepository {
  login(credentials: LoginCredentials): Observable<AuthSession>;
  getCurrentUser(): Observable<User>;
  refreshToken(): Observable<TokenPair>;
  /** Limpia la sesión local (DummyJSON no tiene endpoint de logout). */
  logout(): void;
}

/** Token de inyección del puerto — vive junto al contrato, en el dominio. */
export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>('AuthRepository');
