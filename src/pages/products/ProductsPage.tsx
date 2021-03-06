import { Fragment } from 'react';
import { Card, Loader, Button, Message } from 'semantic-ui-react';

import PageHeading from '../../components/PageHeading';
import useProducts from './useProducts.hooks';
import ProductCard from './ProductCard';

function ProductsPage() {
  const [products, error, loading, reload] = useProducts({});

  return (
    <Fragment>
      <PageHeading icon='shop'>Products</PageHeading>
      <Loader active={loading} />
      {error && (
        <Message negative>
          <Message.Header>Error Loading Products</Message.Header>
          <p>
            Sorry, something went wrong. Press retry to attempt to load them
            again.
          </p>
          <Button onClick={reload} color='red'>
            Retry
          </Button>
        </Message>
      )}
      {products.length > 0 && (
        <Card.Group centered>
          {products.map((product) => {
            return (
              <ProductCard key={product.productId} {...product}>
                <Button>View Product</Button>
              </ProductCard>
            );
          })}
        </Card.Group>
      )}
      {products.length === 0 && !loading && !error && (
        <Message>
          No products available at the current time. Please check back later.
        </Message>
      )}
    </Fragment>
  );
}

export default ProductsPage;
