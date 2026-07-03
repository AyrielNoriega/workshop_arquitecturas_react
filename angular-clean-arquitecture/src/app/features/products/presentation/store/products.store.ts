import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subject, catchError, of, switchMap, tap } from 'rxjs';

import { Category } from '../../domain/models/category.model';
import { Paginated } from '../../domain/models/paginated.model';
import { Product } from '../../domain/models/product.model';
import { ProductQuery } from '../../domain/models/product-query.model';
import { GetCategoriesUseCase } from '../../domain/use-cases/get-categories.use-case';
import { GetProductsByCategoryUseCase } from '../../domain/use-cases/get-products-by-category.use-case';
import { ListProductsUseCase } from '../../domain/use-cases/list-products.use-case';
import { SearchProductsUseCase } from '../../domain/use-cases/search-products.use-case';

const PAGE_SIZE = 12;

/**
 * Facade de estado del listado de productos con signals.
 * Sin providedIn: 'root' — se provee en products.routes.ts (scope del feature lazy).
 * switchMap cancela requests obsoletas si el usuario pagina/busca rápido.
 */
@Injectable()
export class ProductsStore {
  private readonly listProducts = inject(ListProductsUseCase);
  private readonly searchProducts = inject(SearchProductsUseCase);
  private readonly getCategories = inject(GetCategoriesUseCase);
  private readonly getByCategory = inject(GetProductsByCategoryUseCase);

  private readonly _products = signal<Product[]>([]);
  private readonly _total = signal(0);
  private readonly _query = signal<ProductQuery>({ limit: PAGE_SIZE, skip: 0 });

  readonly products = this._products.asReadonly();
  readonly total = this._total.asReadonly();
  readonly query = this._query.asReadonly();
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly categories = signal<Category[]>([]);

  readonly page = computed(() => Math.floor(this._query().skip / this._query().limit) + 1);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this._total() / this._query().limit)));
  readonly hasPrev = computed(() => this._query().skip > 0);
  readonly hasNext = computed(() => this._query().skip + this._query().limit < this._total());

  private readonly fetchTrigger = new Subject<ProductQuery>();

  constructor() {
    this.fetchTrigger
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap((query) =>
          this.sourceFor(query).pipe(
            catchError(() => {
              this.error.set('No se pudieron cargar los productos. Intenta de nuevo.');
              return of(null);
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((page) => {
        if (page) {
          this._products.set(page.items);
          this._total.set(page.total);
        }
        this.loading.set(false);
      });
  }

  load(): void {
    this.fetchTrigger.next(this._query());
  }

  search(term: string): void {
    const q = term.trim() || undefined;
    // Búsqueda y categoría son excluyentes (limitación de DummyJSON).
    this.updateQuery({ q, category: undefined, skip: 0 });
  }

  filterByCategory(category: string | null): void {
    this.updateQuery({ category: category ?? undefined, q: undefined, skip: 0 });
  }

  nextPage(): void {
    if (this.hasNext()) {
      this.updateQuery({ skip: this._query().skip + this._query().limit });
    }
  }

  prevPage(): void {
    if (this.hasPrev()) {
      this.updateQuery({ skip: Math.max(0, this._query().skip - this._query().limit) });
    }
  }

  loadCategories(): void {
    if (this.categories().length > 0) {
      return;
    }
    this.getCategories.execute().subscribe({
      next: (categories) => this.categories.set(categories),
      error: () => this.categories.set([]),
    });
  }

  private updateQuery(patch: Partial<ProductQuery>): void {
    this._query.update((query) => ({ ...query, ...patch }));
    this.load();
  }

  /** Enruta al caso de uso correcto según el estado de la query. */
  private sourceFor(query: ProductQuery): Observable<Paginated<Product>> {
    if (query.q) {
      return this.searchProducts.execute(query);
    }
    if (query.category) {
      return this.getByCategory.execute(query);
    }
    return this.listProducts.execute(query);
  }
}
