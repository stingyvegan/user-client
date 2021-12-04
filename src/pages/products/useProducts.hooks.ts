import { useState, useEffect } from 'react';

import * as productService from '../../services/product.service';
import { Product } from '../../services/product.types';
import * as subscriptionService from '../../services/subscription.service';

export interface GetProductFilters {
  productId?: string;
}

async function getProducts(
  filters: GetProductFilters,
  setProducts: (products: Product[]) => void,
  setError: (error: string | undefined) => void,
  setLoading: (loaded: boolean) => void,
) {
  setError(undefined);
  setLoading(true);
  setProducts([]);
  try {
    if (filters.productId) {
      const product = await productService.fetchProduct(filters.productId);
      setProducts([product]);
    } else {
      const products = await productService.fetchProducts();
      setProducts(products);
    }
  } catch (error) {
    setError(error as string);
  }
  setLoading(false);
}

export interface ProductFilters {
  active: boolean;
  productId?: string;
}

export interface ProductEvent {
  product: Product;
}

export default function useProducts(filters: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const { active = true, productId } = filters;

  function handleProductEvent(event: ProductEvent) {
    setProducts((existing) =>
      existing.map((p) => {
        if (p.productId === event.product.productId) {
          return event.product;
        }
        return p;
      }),
    );
  }

  async function reload() {
    await getProducts(filters, setProducts, setError, setLoading);
    subscriptionService.subscribe('PRODUCT_CHANGED', handleProductEvent);
  }

  useEffect(() => {
    reload();
    function cleanUp() {
      subscriptionService.unsubscribe('PRODUCT_CHANGED', handleProductEvent);
    }
    return cleanUp;
  }, [active, productId]);

  return [products, error, loading, reload] as const;
}
