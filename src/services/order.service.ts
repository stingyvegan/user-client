import getAxios from './apiAxios';
import { WriteBatchOrder, Order } from './order.types';

async function fetchMyOrders(): Promise<Order[]> {
  const axios = await getAxios();
  const orders = await axios.get('/orders/my');
  return orders.data;
}

async function fetchActiveOrders(): Promise<Order[]> {
  const axios = await getAxios();
  const orders = await axios.get('/orders');
  return orders.data;
}

async function upsertOrder(
  orderId: string,
  productId: string,
  username: string,
  batchOrders: WriteBatchOrder[],
) {
  const axios = await getAxios();
  const result = await axios.put('/orders', {
    orderId,
    productId,
    username,
    batchOrders,
  });
  return result.data;
}

export { fetchMyOrders, fetchActiveOrders, upsertOrder };
