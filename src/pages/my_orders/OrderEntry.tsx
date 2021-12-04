import React from 'react';

import { Grid, Table } from 'semantic-ui-react';

import {
  formatUnitSize,
  formatCurrency,
  formatDate,
} from '../../helpers/formatters';
import shortenUuid from '../../helpers/shortenUuid';
import { Segment } from 'semantic-ui-react';
import { Product } from '../../services/product.types';
import { Order } from '../../services/order.types';

export type OrderEntryProps = {
  order: Order;
  product: Product;
};

export default function OrderEntry({ order, product }: OrderEntryProps) {
  const { orderId, orderDate, batchOrders } = order;
  const totalCommitted = batchOrders.reduce((acc, bo) => {
    return acc + bo.committed;
  }, 0);
  return (
    <Segment raised>
      <Grid columns="equal">
        <Grid.Row>
          <Grid.Column>
            <strong>Reference</strong>
            <br />
            {shortenUuid(orderId)}
          </Grid.Column>
          <Grid.Column>
            <strong>Order Date</strong>
            <br />
            {formatDate(orderDate)}
          </Grid.Column>
          <Grid.Column>
            <strong>Product</strong>
            <br />
            {product.name}
          </Grid.Column>
          <Grid.Column>
            <strong>Status</strong>
            <br />
            Committed
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4}>
            <strong>Total Cost</strong>
            <br />
            {formatCurrency(
              (product.totalCost / product.requiredUnits) * totalCommitted,
            )}
            <br />
            <strong>Total Order Size</strong>
            <br />
            {formatUnitSize(
              totalCommitted * product.unitSize,
              product.unitName,
              product.isDiscrete,
            )}
          </Grid.Column>
          <Grid.Column width={12}>
            <Table celled compact>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Batch Reference</Table.HeaderCell>
                  <Table.HeaderCell>Amount</Table.HeaderCell>
                  <Table.HeaderCell>Cost</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {batchOrders.map(bo => (
                  <Table.Row key={bo.batch.batchId}>
                    <Table.Cell>{shortenUuid(bo.batch.batchId)}</Table.Cell>
                    <Table.Cell>
                      {formatUnitSize(
                        bo.committed * product.unitSize,
                        product.unitName,
                        product.isDiscrete,
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {formatCurrency(
                        (product.totalCost / product.requiredUnits) *
                          bo.committed,
                      )}
                    </Table.Cell>
                    <Table.Cell>Pending</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
}
