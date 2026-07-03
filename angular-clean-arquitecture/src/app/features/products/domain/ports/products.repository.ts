import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { Category } from '../models/category.model';
import { Paginated } from '../models/paginated.model';
import { Product } from '../models/product.model';
import { ProductQuery } from '../models/product-query.model';

/** Puerto del repositorio de productos. La capa data lo implementa contra DummyJSON. */
export interface ProductsRepository {
  list(query: ProductQuery): Observable<Paginated<Product>>;
  getById(id: number): Observable<Product>;
  search(query: ProductQuery): Observable<Paginated<Product>>;
  getCategories(): Observable<Category[]>;
  getByCategory(query: ProductQuery): Observable<Paginated<Product>>;
}

/** Token de inyección del puerto — se enlaza a su implementación en products.routes.ts (lazy). */
export const PRODUCTS_REPOSITORY = new InjectionToken<ProductsRepository>('ProductsRepository');
