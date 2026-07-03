import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AUTH_REPOSITORY } from '../ports/auth.repository';
import { TokenPair } from '../models/token-pair.model';

@Injectable({ providedIn: 'root' })
export class RefreshTokenUseCase {
  private readonly repository = inject(AUTH_REPOSITORY);

  execute(): Observable<TokenPair> {
    return this.repository.refreshToken();
  }
}
