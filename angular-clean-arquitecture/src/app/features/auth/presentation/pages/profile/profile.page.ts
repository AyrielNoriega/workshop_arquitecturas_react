import { Component, inject } from '@angular/core';

import { SpinnerComponent } from '@shared/ui/spinner/spinner';

import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-profile-page',
  imports: [SpinnerComponent],
  templateUrl: './profile.page.html',
})
export class ProfilePage {
  protected readonly store = inject(AuthStore);
}
