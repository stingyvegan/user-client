import getAxios from './apiAxios';
import { Product } from './product.types';

async function fetchProduct(productId: string): Promise<Product> {
  const axios = await getAxios();
  const result = await axios.get(`/products/${productId}`);
  return result.data;
}

async function fetchProducts(): Promise<Product[]> {
  const axios = await getAxios();
  const result = await axios.get('/products');
  return result.data;
}

export { fetchProducts, fetchProduct };
