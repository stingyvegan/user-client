import { Fragment, useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  Loader,
  Header,
  Message,
  Grid,
  Image,
} from 'semantic-ui-react';

import useProducts from './useProducts.hooks';
import useMakeOrder from '../my_orders/useMakeOrder';
import OrderEditor from './OrderEditor';
import AuthContext from '../../contexts/Auth.context';
import { WriteBatchOrder } from '../../services/order.types';


export default function ProductPage() {
  const params = useParams();
  const [products, error, loading, reload] = useProducts({
    productId: params.productId,
    active: false,
  });
  const { authDetails } = useContext(AuthContext);
  const product = products.length === 1 ? products[0] : undefined;
  const [isComplete, setIsComplete] = useState(false);

  const [orderLoading, orderError, makeOrder] = useMakeOrder();

  const onCompleteCommit = async (
    productId: string,
    orderId: string | null,
    batchOrders: WriteBatchOrder[],
  ) => {
    if (!authDetails!.currentEmail)
      throw new Error('Cannot make order unauthenticated');
    let filledOrderId = orderId ? orderId : uuidv4();
    const success = await makeOrder(
      filledOrderId,
      productId,
      authDetails!.currentEmail,
      batchOrders,
    );
    if (success) {
      setIsComplete(true);
    }
  };
  return (
    <div>
      <Loader active={loading} />
      {(error || !product) && (
        <Message negative>
          <Message.Header>Error Loading Product</Message.Header>
          <p>
            Sorry, something went wrong. Press retry to attempt to load it
            again.
          </p>
          <Button onClick={reload} color='red'>
            Retry
          </Button>
        </Message>
      )}
      {!loading && !error && product && (
        <Fragment>
          <Grid stackable>
            <Grid.Row columns={2}>
              <Grid.Column textAlign='center'>
                <Header as='h3'>{product.name}</Header>
                <Image src='/assets/img-placeholder-256.png' centered />
              </Grid.Column>
              <Grid.Column textAlign='center'>
                <Header as='h3'>Order</Header>
                {!isComplete ? (
                  <OrderEditor
                    product={product}
                    onCompleteCommit={onCompleteCommit}
                    loading={orderLoading}
                    error={orderError}
                  />
                ) : (
                  <div>
                    <Message success>
                      Congratulations, your order was successful
                    </Message>
                    <Button.Group vertical>
                      <Button as={Link} to='/products'>
                        Return To Products
                      </Button>
                      <Button as={Link} to='/orders'>
                        View My Orders
                      </Button>
                      <Button onClick={() => setIsComplete(false)}>
                        Order More
                      </Button>
                    </Button.Group>
                  </div>
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Fragment>
      )}
    </div>
  );
}
