import { Batch } from "./order.types";

export interface Product {
  isDiscrete: boolean;
  unitName: string;
  unitSize: number;
  requiredUnits: number;
  totalCost: number;
  name: string;
  productId: string;
  supplierName: string;
  totalCommitted: number;
  currentBatch: Batch;
}
