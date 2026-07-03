import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { PRODUCTS_REPOSITORY } from '../ports/products.repository';
import { Product } from '../models/product.model';

@Injectable()
export class GetProductByIdUseCase {
  private readonly repository = inject(PRODUCTS_REPOSITORY);

  execute(id: number): Observable<Product> {
    if (!Number.isInteger(id) || id <= 0) {
      return throwError(() => new Error(`Id de producto inválido: ${id}`));
    }
    return this.repository.getById(id);
  }
}
