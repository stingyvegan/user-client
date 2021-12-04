import { Fragment } from 'react';
import { Table, Loader, Message, Button } from 'semantic-ui-react';

import { formatCurrency } from '../../helpers/formatters';
import shortenUuid from '../../helpers/shortenUuid';
import PageHeading from '../../components/PageHeading';
import useOrders from '../my_orders/useOrders.hooks';

function AdminPage() {
  const [orders, products, isLoading, isLoaded, error, reload] = useOrders({
    my: false,
  });

  return (
    <Fragment>
      <PageHeading icon='tasks'>Active Orders</PageHeading>
      <Loader active={isLoading} />
      {error && (
        <Message negative>
          <Message.Header>Error Loading Orders</Message.Header>
          <p>
            Sorry, something went wrong. Press retry to attempt to load them
            again.
          </p>
          <Button onClick={() => reload()} color='red'>
            Retry
          </Button>
        </Message>
      )}
      {orders.length === 0 && !error && !isLoading && isLoaded && (
        <Message>There are no active orders.</Message>
      )}
      {!isLoading && orders.length > 0 && (
        <Table celled unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Order ID</Table.HeaderCell>
              <Table.HeaderCell>Batch ID</Table.HeaderCell>
              <Table.HeaderCell>User</Table.HeaderCell>
              <Table.HeaderCell>Product</Table.HeaderCell>
              <Table.HeaderCell>Units</Table.HeaderCell>
              <Table.HeaderCell>Cost</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {orders.map((order) => {
              return order.batchOrders.map((bo) => {
                const product = products.find(
                  (p) => p.productId === bo.batch.productId,
                );
                return (
                  <Table.Row key={`${order.orderId}_${bo.batch.batchId}`}>
                    <Table.Cell>{shortenUuid(order.orderId)}</Table.Cell>
                    <Table.Cell>{shortenUuid(bo.batch.batchId)}</Table.Cell>
                    <Table.Cell>{order.username}</Table.Cell>
                    <Table.Cell>
                      {product?.name ||
                        `Unknown Product ${shortenUuid(bo.batch.productId)}`}
                    </Table.Cell>
                    <Table.Cell>{bo.committed}</Table.Cell>
                    <Table.Cell>
                      {product
                        ? formatCurrency(
                            bo.committed *
                              (product.totalCost / product.requiredUnits),
                          )
                        : '$?'}
                    </Table.Cell>
                    <Table.Cell>Pending</Table.Cell>
                  </Table.Row>
                );
              });
            })}
          </Table.Body>
        </Table>
      )}
    </Fragment>
  );
}

export default AdminPage;
