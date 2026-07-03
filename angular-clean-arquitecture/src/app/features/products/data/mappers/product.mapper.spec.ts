import { ProductDto } from '../dtos/product.dto';
import { ProductsResponseDto } from '../dtos/products-response.dto';
import { toCategory, toPaginated, toProduct } from './product.mapper';

const productDto: ProductDto = {
  id: 1,
  title: 'Essence Mascara',
  description: 'A mascara',
  category: 'beauty',
  price: 9.99,
  discountPercentage: 7.17,
  rating: 4.94,
  stock: 5,
  thumbnail: 'thumb.png',
  images: ['a.png'],
};

describe('product.mapper', () => {
  it('toProduct normaliza brand ausente a null', () => {
    const product = toProduct(productDto);
    expect(product.brand).toBeNull();
    expect(product.title).toBe('Essence Mascara');
  });

  it('toProduct conserva brand cuando existe', () => {
    expect(toProduct({ ...productDto, brand: 'Essence' }).brand).toBe('Essence');
  });

  it('toPaginated traduce {products,...} → {items,...}', () => {
    const response: ProductsResponseDto = {
      products: [productDto],
      total: 194,
      skip: 12,
      limit: 12,
    };
    const page = toPaginated(response);
    expect(page.items).toHaveLength(1);
    expect(page.total).toBe(194);
    expect(page.skip).toBe(12);
    expect(page.limit).toBe(12);
  });

  it('toCategory descarta la url del DTO', () => {
    const category = toCategory({ slug: 'beauty', name: 'Beauty', url: 'https://x' });
    expect(category).toEqual({ slug: 'beauty', name: 'Beauty' });
  });
});
