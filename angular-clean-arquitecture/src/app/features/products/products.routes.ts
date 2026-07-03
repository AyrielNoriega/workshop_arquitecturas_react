import { Routes } from '@angular/router';

import { PRODUCTS_REPOSITORY } from './domain/ports/products.repository';
import { GetCategoriesUseCase } from './domain/use-cases/get-categories.use-case';
import { GetProductByIdUseCase } from './domain/use-cases/get-product-by-id.use-case';
import { GetProductsByCategoryUseCase } from './domain/use-cases/get-products-by-category.use-case';
import { ListProductsUseCase } from './domain/use-cases/list-products.use-case';
import { SearchProductsUseCase } from './domain/use-cases/search-products.use-case';
import { ProductsRepositoryImpl } from './data/repositories/products.repository.impl';
import { ProductsStore } from './presentation/store/products.store';

/**
 * Rutas lazy del feature. El binding puerto→implementación y los servicios del feature
 * viven aquí (environment injector de la ruta), no en root: solo se cargan al navegar.
 */
export default [
  {
    path: '',
    providers: [
      { provide: PRODUCTS_REPOSITORY, useClass: ProductsRepositoryImpl },
      ListProductsUseCase,
      GetProductByIdUseCase,
      SearchProductsUseCase,
      GetCategoriesUseCase,
      GetProductsByCategoryUseCase,
      ProductsStore,
    ],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./presentation/pages/product-list/product-list.page').then(
            (m) => m.ProductListPage,
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./presentation/pages/product-detail/product-detail.page').then(
            (m) => m.ProductDetailPage,
          ),
      },
    ],
  },
] satisfies Routes;
