import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthStore } from '@features/auth/presentation/store/auth.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly authStore = inject(AuthStore);

  constructor() {
    // Hidrata la sesión persistida. En SSR el storage es memoria vacía → no-op.
    this.authStore.bootstrap();
  }
}
