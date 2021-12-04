import { WriteBatchOrder } from '../../services/order.types';
import { updateBatches } from '../order_helpers';

const MOCK_UUID = '00000000-0000-0000-0000-000000000000';
jest.mock('uuid', () => ({ v4: () => MOCK_UUID }));

describe('updateBatches', () => {
  test('must add to existing batch if there is room', () => {
    const currentBatches: WriteBatchOrder[] = [
      {
        batchId: '1',
        committed: 0,
        existingCommitted: 3,
      },
    ];
    const expected: WriteBatchOrder[] = [
      {
        batchId: '1',
        committed: 3,
        existingCommitted: 3,
      },
    ];

    const actual = updateBatches(currentBatches, 3, 10);

    expect(actual).toEqual(expected);
  });
  test('must create a new batch if there are none', () => {
    const currentBatches: WriteBatchOrder[] = [];
    const expected: WriteBatchOrder[] = [
      {
        batchId: MOCK_UUID,
        committed: 3,
        existingCommitted: 0,
      },
    ];

    const actual = updateBatches(currentBatches, 3, 10);

    expect(actual).toEqual(expected);
  });
  test("must overflow to a new batch if can't fit in existing", () => {
    const currentBatches: WriteBatchOrder[] = [
      {
        batchId: '1',
        committed: 0,
        existingCommitted: 8,
      },
    ];
    const expected: WriteBatchOrder[] = [
      {
        batchId: '1',
        committed: 2,
        existingCommitted: 8,
      },
      {
        batchId: MOCK_UUID,
        committed: 1,
        existingCommitted: 0,
      },
    ];

    const actual = updateBatches(currentBatches, 3, 10);

    expect(actual).toEqual(expected);
  });
  test('must overflow to multiple new batches if required', () => {
    const currentBatches: WriteBatchOrder[] = [
      {
        batchId: '1',
        committed: 0,
        existingCommitted: 9,
      },
    ];
    const expected: WriteBatchOrder[] = [
      {
        batchId: '1',
        committed: 1,
        existingCommitted: 9,
      },
      {
        batchId: MOCK_UUID,
        committed: 10,
        existingCommitted: 0,
      },
      {
        batchId: MOCK_UUID,
        committed: 4,
        existingCommitted: 0,
      },
    ];

    const actual = updateBatches(currentBatches, 15, 10);

    expect(actual).toEqual(expected);
  });
});
