import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AUTH_REPOSITORY } from '../ports/auth.repository';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class GetCurrentUserUseCase {
  private readonly repository = inject(AUTH_REPOSITORY);

  execute(): Observable<User> {
    return this.repository.getCurrentUser();
  }
}
