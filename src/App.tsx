import { useContext } from 'react';
import { Container, Loader } from 'semantic-ui-react';
import { Route, Routes } from 'react-router-dom';

import AuthContext from './contexts/Auth.context';
import ProfilePage from './login/ProfilePage';
import Header from './components/Header';

import requiresAuthorisation from './helpers/requires-authorisation';
import MyOrders from './pages/my_orders/MyOrders';
import Products from './pages/products/Products';
import Product from './pages/products/Product';

function App() {
  const { authDetails } = useContext(AuthContext);

  const initialLoad = authDetails.authState === 'loading';

  return (
    <>
      <Loader active={initialLoad} />
      <Header loading={initialLoad} />
      <Container className='page'>
        <Routes>
          <Route
            path='/orders'
            element={requiresAuthorisation(
              <MyOrders />,
              authDetails.currentAuthenticatedUser,
              'order',
              initialLoad,
            )}
          />
          <Route
            path='/products'
            element={requiresAuthorisation(
              <Products />,
              authDetails.currentAuthenticatedUser,
              'product',
              initialLoad,
            )}
          />
          <Route
            path='/product/:productId'
            element={requiresAuthorisation(
              <Product />,
              authDetails.currentAuthenticatedUser,
              'product',
              initialLoad,
            )}
          />
          {/* <Route
          path='/admin'
          element={requiresAuthorisation(
            <Admin />,
            authDetails.currentAuthenticatedUser,
            ['admin'],
            initialLoad,
          )}
        /> */}
          <Route path='(/|/profile)' element={<ProfilePage />} />
        </Routes>
        {/* <GoogleAnalytics /> */}
      </Container>
    </>
  );
}

export default App;
