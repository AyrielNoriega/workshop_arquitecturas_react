import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { API_BASE_URL } from '@core/config/api.config';
import { STORAGE } from '@core/storage/storage.token';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@core/storage/storage-keys';

import { AuthRepository } from '../../domain/ports/auth.repository';
import { AuthSession } from '../../domain/models/auth-session.model';
import { LoginCredentials } from '../../domain/models/login-credentials.model';
import { TokenPair } from '../../domain/models/token-pair.model';
import { User } from '../../domain/models/user.model';
import { LoginRequestDto } from '../dtos/login-request.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { RefreshResponseDto } from '../dtos/refresh-response.dto';
import { UserDto } from '../dtos/user.dto';
import { toAuthSession, toTokenPair, toUser } from '../mappers/auth.mapper';

/**
 * Adaptador HTTP del puerto AuthRepository contra DummyJSON.
 * Única clase que conoce los DTOs y la persistencia de tokens.
 */
@Injectable()
export class AuthRepositoryImpl implements AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly storage = inject(STORAGE);

  login(credentials: LoginCredentials): Observable<AuthSession> {
    const body: LoginRequestDto = {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: credentials.expiresInMins,
    };
    return this.http.post<LoginResponseDto>(`${this.baseUrl}/auth/login`, body).pipe(
      map(toAuthSession),
      tap((session) => this.persistTokens(session)),
    );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<UserDto>(`${this.baseUrl}/auth/me`).pipe(map(toUser));
  }

  refreshToken(): Observable<TokenPair> {
    const refreshToken = this.storage.get(REFRESH_TOKEN_KEY);
    return this.http
      .post<RefreshResponseDto>(`${this.baseUrl}/auth/refresh`, { refreshToken })
      .pipe(
        map(toTokenPair),
        tap((pair) => this.persistTokens(pair)),
      );
  }

  logout(): void {
    this.storage.remove(ACCESS_TOKEN_KEY);
    this.storage.remove(REFRESH_TOKEN_KEY);
  }

  private persistTokens(pair: TokenPair): void {
    this.storage.set(ACCESS_TOKEN_KEY, pair.accessToken);
    this.storage.set(REFRESH_TOKEN_KEY, pair.refreshToken);
  }
}
