import { v4 as uuidv4 } from 'uuid';
import { WriteBatchOrder } from '../services/order.types';

export function updateBatches(
  /** Current state of the batches. */
  currentBatches: WriteBatchOrder[],
  /** The total number of units wanted. */
  newAmount: number,
  /** Required units to fill a single batch. */
  requiredUnits: number,
) {
  // Keep track of how many units remaining to order
  let remaining = newAmount;

  // First allocate to any existing batch that has space
  const updatedBatchOrders = currentBatches
    .map((bo) => {
      if (remaining === 0) {
        return {
          ...bo,
          committed: 0,
        };
      } else if (bo.committed <= remaining) {
        remaining -= bo.committed;
        if (bo.committed < requiredUnits - bo.existingCommitted) {
          const toUse = Math.min(
            requiredUnits - bo.existingCommitted - bo.committed,
            remaining,
          );
          remaining -= toUse;
          return {
            ...bo,
            committed: bo.committed + toUse,
          };
        }
        return bo;
      } else {
        const toUse = remaining;
        remaining = 0;
        return {
          ...bo,
          committed: toUse,
        };
      }
    })
    .filter((bo) => bo.committed > 0 || bo.existingCommitted > 0);

  // While there are still more to allocate create new batch orders
  const newBatchOrders: WriteBatchOrder[] = [];
  while (remaining > 0) {
    const toUse = Math.min(remaining, requiredUnits);
    remaining -= toUse;
    newBatchOrders.push({
      batchId: uuidv4(),
      existingCommitted: 0,
      committed: toUse,
    });
  }

  // Join the existing and new orders together
  const result = updatedBatchOrders.concat(newBatchOrders);
  if (result.length > 0) {
    return result;
  } else {
    return [
      {
        batchId: uuidv4(),
        existingCommitted: 0,
        committed: 0,
      },
    ];
  }
}
