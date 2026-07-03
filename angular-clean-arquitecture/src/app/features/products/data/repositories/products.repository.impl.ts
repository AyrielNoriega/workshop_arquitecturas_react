import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { API_BASE_URL } from '@core/config/api.config';

import { ProductsRepository } from '../../domain/ports/products.repository';
import { Category } from '../../domain/models/category.model';
import { Paginated } from '../../domain/models/paginated.model';
import { Product } from '../../domain/models/product.model';
import { ProductQuery } from '../../domain/models/product-query.model';
import { CategoryDto, ProductDto } from '../dtos/product.dto';
import { ProductsResponseDto } from '../dtos/products-response.dto';
import { toCategory, toPaginated, toProduct } from '../mappers/product.mapper';

/** Adaptador HTTP del puerto ProductsRepository contra DummyJSON. */
@Injectable()
export class ProductsRepositoryImpl implements ProductsRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  list(query: ProductQuery): Observable<Paginated<Product>> {
    return this.http
      .get<ProductsResponseDto>(`${this.baseUrl}/products`, {
        params: this.paginationParams(query),
      })
      .pipe(map(toPaginated));
  }

  getById(id: number): Observable<Product> {
    return this.http.get<ProductDto>(`${this.baseUrl}/products/${id}`).pipe(map(toProduct));
  }

  search(query: ProductQuery): Observable<Paginated<Product>> {
    return this.http
      .get<ProductsResponseDto>(`${this.baseUrl}/products/search`, {
        params: this.paginationParams(query).set('q', query.q ?? ''),
      })
      .pipe(map(toPaginated));
  }

  getCategories(): Observable<Category[]> {
    return this.http
      .get<CategoryDto[]>(`${this.baseUrl}/products/categories`)
      .pipe(map((dtos) => dtos.map(toCategory)));
  }

  getByCategory(query: ProductQuery): Observable<Paginated<Product>> {
    return this.http
      .get<ProductsResponseDto>(`${this.baseUrl}/products/category/${query.category}`, {
        params: this.paginationParams(query),
      })
      .pipe(map(toPaginated));
  }

  private paginationParams(query: ProductQuery): HttpParams {
    return new HttpParams().set('limit', query.limit).set('skip', query.skip);
  }
}
