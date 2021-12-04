export interface Batch {
  batchId: string;
  productId: string;
}

export interface ReadBatchOrder {
  existingCommitted: number;
  committed: number;
  batch: Batch;
}

export interface Order {
  orderId: string;
  batchOrders: ReadBatchOrder[];
  orderDate: string;
}

export interface WriteBatchOrder {
  existingCommitted: number;
  committed: number;
  batchId: string;
}
