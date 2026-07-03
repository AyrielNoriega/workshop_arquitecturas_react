import { Component } from '@angular/core';

/** Indicador de carga. El tamaño/color se controla con clases Tailwind en el host. */
@Component({
  selector: 'app-spinner',
  template: `
    <svg class="h-full w-full animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
  `,
  host: { class: 'inline-block', role: 'status', 'aria-label': 'Cargando' },
})
export class SpinnerComponent {}
