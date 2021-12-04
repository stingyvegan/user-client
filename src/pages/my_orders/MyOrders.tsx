import { Fragment } from 'react';
import { Loader, Message, Button } from 'semantic-ui-react';
import PageHeading from '../../components/PageHeading';
import useOrders from './useOrders.hooks';
import OrderEntry from './OrderEntry';

function MyOrders() {
  const [orders, products, isLoading, isLoaded, error, reload] = useOrders({
    my: true,
  });

  return (
    <Fragment>
      <PageHeading icon='shopping bag'>My Orders</PageHeading>
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
        <Message>You haven't made any orders yet!</Message>
      )}
      {orders.map((order) => {
        const pid = order.batchOrders[0].batch.productId;
        const product = products.find((p) => p.productId === pid);
        if (!product)
          throw new Error(
            `Unable to load product ${pid} for order ${order.orderId}`,
          );
        return (
          <OrderEntry key={order.orderId} order={order} product={product} />
        );
      })}
    </Fragment>
  );
}

export default MyOrders;
