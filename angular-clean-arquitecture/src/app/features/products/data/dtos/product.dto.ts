/** Espejo (parcial) del producto de DummyJSON — solo los campos que consume la app. */
export interface ProductDto {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
}

/** Elemento de GET /products/categories. */
export interface CategoryDto {
  slug: string;
  name: string;
  url: string;
}
