import { Category } from '../../domain/models/category.model';
import { Paginated } from '../../domain/models/paginated.model';
import { Product } from '../../domain/models/product.model';
import { CategoryDto, ProductDto } from '../dtos/product.dto';
import { ProductsResponseDto } from '../dtos/products-response.dto';

export function toProduct(dto: ProductDto): Product {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    category: dto.category,
    price: dto.price,
    discountPercentage: dto.discountPercentage,
    rating: dto.rating,
    stock: dto.stock,
    brand: dto.brand ?? null,
    thumbnail: dto.thumbnail,
    images: dto.images,
  };
}

export function toPaginated(dto: ProductsResponseDto): Paginated<Product> {
  return {
    items: dto.products.map(toProduct),
    total: dto.total,
    skip: dto.skip,
    limit: dto.limit,
  };
}

export function toCategory(dto: CategoryDto): Category {
  return { slug: dto.slug, name: dto.name };
}
