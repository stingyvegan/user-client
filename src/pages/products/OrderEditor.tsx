import { Fragment, useState } from 'react';
import styled from 'styled-components';
import {
  Button,
  Grid,
  Header,
  Loader,
  Message,
  Progress,
  SemanticWIDTHSNUMBER,
} from 'semantic-ui-react';
import { v4 as uuidv4 } from 'uuid';

import AmountSelector from '../../components/AmountSelector';
import {
  formatCurrency,
  formatIndividualUnit,
  formatUnitSize,
} from '../../helpers/formatters';
import { updateBatches } from '../../helpers/order_helpers';
import ConfirmOrderModal from './ConfirmOrderModal';
import { batchMessage } from './products.constants';
import { Product } from '../../services/product.types';
import { WriteBatchOrder } from '../../services/order.types';

interface MergedBatch {
  ids: any;
  batchCount: number;
  existingUnits: any;
  units: number;
}

export type OrderEditorProps = {
  product: Product;
  error: string | undefined;
  loading: boolean;
  onCompleteCommit: (
    productId: string,
    orderId: string | null,
    batchOrders: WriteBatchOrder[],
  ) => void;
  className?: string;
};

export default styled(function OrderEditor(props: OrderEditorProps) {
  const { product, error, loading, onCompleteCommit, className } = props;
  const [batchOrders, setBatchOrders] = useState(
    product.currentBatch
      ? [
          {
            batchId: product.currentBatch || uuidv4(),
            existingCommitted: product.totalCommitted,
            committed: 0,
          },
        ]
      : [],
  );
  const [confirming, setConfirming] = useState(false);

  const currentCommitted = batchOrders.reduce((acc, bo) => {
    return acc + bo.committed;
  }, 0);

  const handleOrderConfirmed = () => {
    onCompleteCommit(product.productId, null, batchOrders);
  };

  const handleAmountChanged = (amount: number) => {
    setBatchOrders((current) => {
      return updateBatches(current, amount, product.requiredUnits);
    });
  };

  const batchWarning =
    batchOrders.length > 1 &&
    batchOrders.some(
      (bo) => bo.committed + bo.existingCommitted < product.requiredUnits,
    );

  const mergedBatches = batchOrders.reduce<MergedBatch[]>((acc, bo) => {
    const last = acc[acc.length - 1];
    if (last && bo.committed + bo.existingCommitted === product.requiredUnits) {
      return acc.map((v, i) => {
        if (i === acc.length - 1) {
          return {
            ...v,
            units: v.units + bo.committed,
            existingUnits: v.existingUnits + bo.existingCommitted,
            batchCount: v.batchCount + 1,
            ids: `${v.ids},${bo.batchId}`,
          };
        }
        return v;
      });
    }
    return acc.concat({
      existingUnits: bo.existingCommitted,
      units: bo.committed,
      batchCount: 1,
      ids: bo.batchId,
    });
  }, []);

  const totalAmount = formatUnitSize(
    currentCommitted * product.unitSize,
    product.unitName,
    product.isDiscrete,
  );
  const totalCost = formatCurrency(
    (product.totalCost / product.requiredUnits) * currentCommitted,
  );

  return (
    <div className={className}>
      <Grid>
        <Loader active={loading} />
        <Grid.Row columns={2}>
          <Grid.Column>
            <Header sub>Price</Header>
            <span>
              {`${formatCurrency(
                product.totalCost / product.requiredUnits,
              )} per ${formatIndividualUnit(
                product.isDiscrete,
                product.unitSize,
                product.unitName,
              )}`}
            </span>
          </Grid.Column>
          <Grid.Column>
            <Header sub>Total</Header>
            <span>{totalCost}</span>
          </Grid.Column>
        </Grid.Row>
        <Fragment>
          <Grid.Row>
            <Grid.Column>
              <AmountSelector
                committedUnits={currentCommitted}
                product={product}
                onAmountChanged={handleAmountChanged}
              />
            </Grid.Column>
          </Grid.Row>
          {error && (
            <Grid.Row>
              <Grid.Column color='red' textAlign='center'>
                Sorry, something went wrong.
              </Grid.Column>
            </Grid.Row>
          )}
          {mergedBatches.length > 0 && (
            <Grid.Row
              textAlign='center'
              columns={mergedBatches.length as SemanticWIDTHSNUMBER}
            >
              {mergedBatches.map((bo) => {
                const required =
                  product.requiredUnits * bo.batchCount - bo.existingUnits;
                const progress = (bo.units / required) * 100;
                const committedText = formatUnitSize(
                  bo.units * product.unitSize,
                  product.unitName,
                  product.isDiscrete,
                );
                const requiredText = formatUnitSize(
                  required * product.unitSize,
                  product.unitName,
                  product.isDiscrete,
                );
                return (
                  <Grid.Column key={bo.ids}>
                    <Progress percent={progress} />
                    {committedText} / {requiredText}
                  </Grid.Column>
                );
              })}
            </Grid.Row>
          )}
          {batchWarning && (
            <Grid.Row columns={1} centered>
              <Message warning>{batchMessage}</Message>
            </Grid.Row>
          )}
          <Grid.Row columns={2}>
            <Grid.Column />
            <Grid.Column textAlign='right'>
              <Button
                disabled={currentCommitted === 0}
                color='green'
                onClick={() => setConfirming(true)}
              >
                {error ? 'Retry' : 'Order'}
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Fragment>
      </Grid>
      <ConfirmOrderModal
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          handleOrderConfirmed();
        }}
        productName={product.name}
        orderAmount={totalAmount}
        orderCost={totalCost}
        batchWarning={batchWarning}
      />
    </div>
  );
})`
  max-width: 25rem;
  margin: auto;
`;
