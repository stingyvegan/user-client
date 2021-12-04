export interface Batch {
  batchId: string;
  productId: string;
}

export interface BatchOrder {
  committed: number;
  batch: Batch;
}

export interface Order {
  orderId: string;
  batchOrders: BatchOrder[];
  orderDate: string;
}
