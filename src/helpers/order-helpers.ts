import { v4 as uuidv4 } from 'uuid';
import { WriteBatchOrder } from '../services/order.types';

export function updateBatches(
  currentBatches: WriteBatchOrder[],
  newAmount: number,
  requiredUnits: number,
) {
  let remaining = newAmount;
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
