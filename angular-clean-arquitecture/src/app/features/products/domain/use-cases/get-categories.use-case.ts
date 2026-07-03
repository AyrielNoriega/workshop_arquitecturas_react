import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PRODUCTS_REPOSITORY } from '../ports/products.repository';
import { Category } from '../models/category.model';

@Injectable()
export class GetCategoriesUseCase {
  private readonly repository = inject(PRODUCTS_REPOSITORY);

  execute(): Observable<Category[]> {
    return this.repository.getCategories();
  }
}
