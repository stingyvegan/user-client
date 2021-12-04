import { useState } from 'react';

import * as orderService from '../../services/order.service';
import { WriteBatchOrder } from '../../services/order.types';

async function _makeOrder(
  orderId: string,
  productId: string,
  username: string,
  batchOrders: WriteBatchOrder[],
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | undefined) => void,
) {
  let success = false;
  setIsLoading(true);
  try {
    await orderService.upsertOrder(orderId, productId, username, batchOrders);
    setError(undefined);
    success = true;
  } catch (e) {
    setError('Failed to make order');
  }
  setIsLoading(false);
  return success;
}

export default function useMakeOrder() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  async function makeOrder(
    orderId: string,
    productId: string,
    username: string,
    batchOrders: WriteBatchOrder[],
  ) {
    return _makeOrder(
      orderId,
      productId,
      username,
      batchOrders,
      setIsLoading,
      setError,
    );
  }

  function clearError() {
    setError(undefined);
  }

  return [isLoading, error, makeOrder, clearError] as const;
}
