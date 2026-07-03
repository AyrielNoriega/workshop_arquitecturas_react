import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { SpinnerComponent } from '@shared/ui/spinner/spinner';

import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, SpinnerComponent],
  templateUrl: './login.page.html',
})
export class LoginPage {
  protected readonly store = inject(AuthStore);
  private readonly fb = inject(FormBuilder);

  /** Poblado por el router (withComponentInputBinding) desde ?returnUrl=. */
  readonly returnUrl = input<string>();

  protected readonly form = this.fb.nonNullable.group({
    username: ['emilys', Validators.required],
    password: ['emilyspass', Validators.required],
  });

  protected submit(): void {
    if (this.form.invalid || this.store.loading()) {
      return;
    }
    this.store.login(this.form.getRawValue(), this.returnUrl());
  }
}
