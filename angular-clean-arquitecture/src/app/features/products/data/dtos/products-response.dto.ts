import { ProductDto } from './product.dto';

/** Respuesta paginada de /products, /products/search y /products/category/:cat. */
export interface ProductsResponseDto {
  products: ProductDto[];
  total: number;
  skip: number;
  limit: number;
}
