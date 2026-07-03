import { Injectable, inject } from '@angular/core';

import { AUTH_REPOSITORY } from '../ports/auth.repository';

@Injectable({ providedIn: 'root' })
export class LogoutUseCase {
  private readonly repository = inject(AUTH_REPOSITORY);

  execute(): void {
    this.repository.logout();
  }
}
