import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { Paginated } from '../../domain/models/paginated.model';
import { Product } from '../../domain/models/product.model';
import { ProductQuery } from '../../domain/models/product-query.model';
import { GetCategoriesUseCase } from '../../domain/use-cases/get-categories.use-case';
import { GetProductsByCategoryUseCase } from '../../domain/use-cases/get-products-by-category.use-case';
import { ListProductsUseCase } from '../../domain/use-cases/list-products.use-case';
import { SearchProductsUseCase } from '../../domain/use-cases/search-products.use-case';
import { ProductsStore } from './products.store';

const product: Product = {
  id: 1,
  title: 'Mascara',
  description: 'x',
  category: 'beauty',
  price: 9.99,
  discountPercentage: 0,
  rating: 4.9,
  stock: 5,
  brand: null,
  thumbnail: 't.png',
  images: [],
};

function page(items: Product[], total: number, query: ProductQuery): Paginated<Product> {
  return { items, total, skip: query.skip, limit: query.limit };
}

describe('ProductsStore', () => {
  let store: ProductsStore;
  let list: ReturnType<typeof vi.fn>;
  let search: ReturnType<typeof vi.fn>;
  let byCategory: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    list = vi.fn((q: ProductQuery) => of(page([product], 50, q)));
    search = vi.fn((q: ProductQuery) => of(page([product], 3, q)));
    byCategory = vi.fn((q: ProductQuery) => of(page([product], 8, q)));

    TestBed.configureTestingModule({
      providers: [
        ProductsStore,
        { provide: ListProductsUseCase, useValue: { execute: list } },
        { provide: SearchProductsUseCase, useValue: { execute: search } },
        { provide: GetProductsByCategoryUseCase, useValue: { execute: byCategory } },
        { provide: GetCategoriesUseCase, useValue: { execute: vi.fn(() => of([])) } },
      ],
    });
    store = TestBed.inject(ProductsStore);
  });

  it('load() lista y actualiza los signals', () => {
    store.load();
    expect(list).toHaveBeenCalledWith({ limit: 12, skip: 0 });
    expect(store.products()).toEqual([product]);
    expect(store.total()).toBe(50);
    expect(store.loading()).toBe(false);
    expect(store.page()).toBe(1);
    expect(store.totalPages()).toBe(5);
    expect(store.hasNext()).toBe(true);
    expect(store.hasPrev()).toBe(false);
  });

  it('nextPage()/prevPage() mueven el skip dentro de los límites', () => {
    store.load();
    store.nextPage();
    expect(store.query().skip).toBe(12);
    expect(store.page()).toBe(2);
    store.prevPage();
    expect(store.query().skip).toBe(0);
    store.prevPage(); // sin efecto: ya está en la primera página
    expect(store.query().skip).toBe(0);
  });

  it('search() usa el caso de uso de búsqueda, resetea skip y limpia categoría', () => {
    store.filterByCategory('beauty');
    store.nextPage();
    store.search('mascara');

    const lastCall = search.mock.calls.at(-1)?.[0] as ProductQuery;
    expect(lastCall.q).toBe('mascara');
    expect(lastCall.category).toBeUndefined();
    expect(lastCall.skip).toBe(0);
  });

  it('filterByCategory() usa el caso de uso por categoría y limpia la búsqueda', () => {
    store.search('mascara');
    store.filterByCategory('beauty');

    const lastCall = byCategory.mock.calls.at(-1)?.[0] as ProductQuery;
    expect(lastCall.category).toBe('beauty');
    expect(lastCall.q).toBeUndefined();
  });

  it('search con término vacío vuelve al listado normal', () => {
    store.search('   ');
    expect(list).toHaveBeenCalled();
    expect(search).not.toHaveBeenCalled();
  });

  it('un error deja mensaje y apaga el loading sin romper el stream', () => {
    list.mockReturnValueOnce(throwError(() => new Error('api caída')));
    store.load();
    expect(store.error()).toContain('No se pudieron cargar');
    expect(store.loading()).toBe(false);

    // El stream sigue vivo: la siguiente carga funciona.
    store.load();
    expect(store.products()).toEqual([product]);
    expect(store.error()).toBeNull();
  });
});
