import { Menu, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import authServiceInstance, { AuthState } from '../auth/auth.service';
import { useContext } from 'react';
import AuthContext from '../contexts/Auth.context';
import { canAccess } from '../rbac';

type LoginMenuItemProps = {
  handleLogout: () => void;
  authState: AuthState;
  name: string;
};
function LoginMenuItem({ authState, name, handleLogout }: LoginMenuItemProps) {
  if (authState === 'logged_in') {
    return (
      <Menu.Menu position='right'>
        <Dropdown item text={name}>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to='/profile'>
              My Profile
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
    );
  } else {
    return (
      <Menu.Item position='right' as={Link} to='/profile'>
        Sign In
      </Menu.Item>
    );
  }
}

export type HeaderProps = {
  loading: boolean;
};

function Header({ loading }: HeaderProps) {
  const { handleLogout, authDetails } = useContext(AuthContext);
  const roles = authDetails?.currentAuthenticatedUser?.groups || [];
  return (
    <Menu inverted stackable attached>
      {canAccess(roles, 'product') && (
        <Menu.Item as={Link} to='/products'>
          Products
        </Menu.Item>
      )}
      {canAccess(roles, 'order') && (
        <Menu.Item as={Link} to='/orders'>
          Orders
        </Menu.Item>
      )}
      {canAccess(roles, 'admin') && (
        <Menu.Item as={Link} to='/admin'>
          Admin
        </Menu.Item>
      )}
      {!loading && (
        <LoginMenuItem
          handleLogout={handleLogout}
          name={authDetails!.currentAuthenticatedUser!.name}
          authState={authDetails.authState}
        />
      )}
    </Menu>
  );
}
export default Header;
