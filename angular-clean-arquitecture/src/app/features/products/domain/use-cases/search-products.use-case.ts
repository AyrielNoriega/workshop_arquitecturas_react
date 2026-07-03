import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PRODUCTS_REPOSITORY } from '../ports/products.repository';
import { Paginated } from '../models/paginated.model';
import { Product } from '../models/product.model';
import { ProductQuery } from '../models/product-query.model';

@Injectable()
export class SearchProductsUseCase {
  private readonly repository = inject(PRODUCTS_REPOSITORY);

  execute(query: ProductQuery): Observable<Paginated<Product>> {
    return this.repository.search(query);
  }
}
