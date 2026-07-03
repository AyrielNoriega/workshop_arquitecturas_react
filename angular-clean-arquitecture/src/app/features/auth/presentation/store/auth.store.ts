import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { STORAGE } from '@core/storage/storage.token';
import { ACCESS_TOKEN_KEY } from '@core/storage/storage-keys';

import { LoginCredentials } from '../../domain/models/login-credentials.model';
import { User } from '../../domain/models/user.model';
import { GetCurrentUserUseCase } from '../../domain/use-cases/get-current-user.use-case';
import { LoginUseCase } from '../../domain/use-cases/login.use-case';
import { LogoutUseCase } from '../../domain/use-cases/logout.use-case';

/**
 * Facade de estado de autenticación con signals.
 * Única superficie que consumen páginas, guards y layout.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly getCurrentUserUseCase = inject(GetCurrentUserUseCase);
  private readonly storage = inject(STORAGE);
  private readonly router = inject(Router);

  private readonly _user = signal<User | null>(null);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  /** ¿Hay token persistido? Permite al guard decidir antes de que /auth/me responda. */
  hasStoredSession(): boolean {
    return this.storage.get(ACCESS_TOKEN_KEY) !== null;
  }

  login(credentials: LoginCredentials, returnUrl?: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.loginUseCase.execute(credentials).subscribe({
      next: (session) => {
        this._user.set(session.user);
        this.loading.set(false);
        this.router.navigateByUrl(returnUrl ?? '/products');
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.error.set(this.messageFrom(err));
      },
    });
  }

  logout(): void {
    this.logoutUseCase.execute();
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Hidrata la sesión al arrancar en el browser: si hay token persistido, carga el usuario.
   * En SSR el storage es memoria vacía, así que es un no-op (primer render = invitado).
   */
  bootstrap(): void {
    if (!this.hasStoredSession()) {
      return;
    }
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.loading.set(true);
    this.getCurrentUserUseCase.execute().subscribe({
      next: (user) => {
        this._user.set(user);
        this.loading.set(false);
      },
      error: () => {
        // Token inválido y refresh fallido: onSessionExpired ya limpió la sesión.
        this._user.set(null);
        this.loading.set(false);
      },
    });
  }

  /** Invocado por el interceptor de refresh (vía AUTH_SESSION_EXPIRED_HANDLER) cuando falla. */
  onSessionExpired(): void {
    this.logoutUseCase.execute();
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  private messageFrom(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      const apiMessage = (err.error as { message?: string } | null)?.message;
      return apiMessage ?? 'No se pudo iniciar sesión. Intenta de nuevo.';
    }
    return err instanceof Error ? err.message : 'Error inesperado';
  }
}
