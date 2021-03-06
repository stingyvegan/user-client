import { useContext } from 'react';
import styled from 'styled-components';
import { Container, Loader } from 'semantic-ui-react';
import { Route, Routes } from 'react-router-dom';

import AuthContext from './contexts/Auth.context';
import ProfilePage from './login/ProfilePage';
import Header from './components/Header';

import requiresAuthorisation from './helpers/requires-authorisation';
import MyOrders from './pages/my_orders/MyOrders';
import ProductsPage from './pages/products/ProductsPage';
import ProductPage from './pages/products/ProductPage';
import AdminPage from './pages/admin/AdminPage';
import GoogleAnalytics from './components/GoogleAnalytics';

const PageContainer = styled(Container)`
  margin-top: 1rem;
`;

function App() {
  const { authDetails } = useContext(AuthContext);

  const initialLoad = authDetails.authState === 'loading';

  return (
    <>
      <Loader active={initialLoad} />
      <Header loading={initialLoad} />
      <PageContainer className='page'>
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
              <ProductsPage />,
              authDetails.currentAuthenticatedUser,
              'product',
              initialLoad,
            )}
          />
          <Route
            path='/product/:productId'
            element={requiresAuthorisation(
              <ProductPage />,
              authDetails.currentAuthenticatedUser,
              'product',
              initialLoad,
            )}
          />
          <Route
            path='/admin'
            element={requiresAuthorisation(
              <AdminPage />,
              authDetails.currentAuthenticatedUser,
              'admin',
              initialLoad,
            )}
          />
          <Route path='*' element={<ProfilePage />} />
        </Routes>
        <GoogleAnalytics />
      </PageContainer>
    </>
  );
}

export default App;
