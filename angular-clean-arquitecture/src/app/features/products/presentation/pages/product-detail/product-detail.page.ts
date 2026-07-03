import { Component, effect, inject, input, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { SpinnerComponent } from '@shared/ui/spinner/spinner';

import { Product } from '../../../domain/models/product.model';
import { GetProductByIdUseCase } from '../../../domain/use-cases/get-product-by-id.use-case';

@Component({
  selector: 'app-product-detail-page',
  imports: [CurrencyPipe, RouterLink, SpinnerComponent],
  templateUrl: './product-detail.page.html',
})
export class ProductDetailPage {
  private readonly getProductById = inject(GetProductByIdUseCase);

  /** Poblado por el router (withComponentInputBinding) desde el segmento :id. */
  readonly id = input.required<string>();

  protected readonly product = signal<Product | null>(null);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.loadProduct(Number(this.id()));
    });
  }

  private loadProduct(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.product.set(null);
    this.getProductById.execute(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el producto.');
        this.loading.set(false);
      },
    });
  }
}
