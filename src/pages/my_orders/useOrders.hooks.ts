import { useState, useEffect, useCallback } from 'react';

import * as orderService from '../../services/order.service';
import { Order } from '../../services/order.types';
import * as productService from '../../services/product.service';
import { Product } from '../../services/product.types';

export type OrderFilters = {
  my: boolean;
};

async function getOrders(
  onlyMy: boolean,
  setIsLoading: (isLoading: boolean) => void,
  setOrders: (orders: Order[]) => void,
  setProducts: (products: Product[]) => void,
  setIsLoaded: (loaded: boolean) => void,
  setError: (error: string | undefined) => void,
) {
  setIsLoading(true);
  setIsLoaded(false);
  setOrders([]);
  setProducts([]);
  try {
    const fetcher = onlyMy
      ? orderService.fetchMyOrders()
      : orderService.fetchActiveOrders();
    const orders = await fetcher;
    const productIds = Object.keys(
      orders.reduce((products, order) => {
        return order.batchOrders.reduce((p, bo) => {
          return {
            ...p,
            [bo.batch.productId]: true,
          };
        }, products);
      }, {}),
    );
    const products = await Promise.all(
      productIds.map((pid) => productService.fetchProduct(pid)),
    );
    setProducts(products);
    setOrders(orders);
    setError(undefined);
  } catch (err) {
    setError(err as string);
  } finally {
    setIsLoading(false);
    setIsLoaded(true);
  }
}

export default function useOrders(filters: OrderFilters) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const { my } = filters;

  const reload = useCallback(
    () =>
      getOrders(
        my,
        setIsLoading,
        setOrders,
        setProducts,
        setIsLoaded,
        setError,
      ),
    [my],
  );

  useEffect(() => {
    reload();
  }, [reload]);

  return [orders, products, isLoading, isLoaded, error, reload] as const;
}
