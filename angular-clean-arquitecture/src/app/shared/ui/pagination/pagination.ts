import { Component, input, output } from '@angular/core';

/** Paginador simple anterior/siguiente. Presentacional puro: sin estado propio. */
@Component({
  selector: 'app-pagination',
  template: `
    <nav class="flex items-center justify-center gap-4" aria-label="Paginación">
      <button
        type="button"
        [disabled]="!hasPrev()"
        (click)="prev.emit()"
        class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← Anterior
      </button>

      <span class="text-sm text-gray-600">
        Página <strong>{{ page() }}</strong> de <strong>{{ totalPages() }}</strong>
      </span>

      <button
        type="button"
        [disabled]="!hasNext()"
        (click)="next.emit()"
        class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Siguiente →
      </button>
    </nav>
  `,
})
export class PaginationComponent {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly hasPrev = input.required<boolean>();
  readonly hasNext = input.required<boolean>();

  readonly prev = output<void>();
  readonly next = output<void>();
}
