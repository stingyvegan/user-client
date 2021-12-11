import { Menu, Dropdown, Modal, Label, Icon, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { AuthState } from '../auth/auth.service';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../contexts/Auth.context';
import { canAccess } from '../rbac';
import versionServiceInstance, {
  versionInitialValue,
} from '../services/version.service';

type LoginMenuItemProps = {
  handleLogoutPressed: () => void;
  handleAboutPressed: () => void;
  authState: AuthState;
  name?: string;
};
function LoginMenuItem({
  authState,
  name,
  handleLogoutPressed,
  handleAboutPressed,
}: LoginMenuItemProps) {
  if (authState === 'logged_in') {
    return (
      <Menu.Menu position='right'>
        <Dropdown item text={name}>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to='/profile'>
              My Profile
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogoutPressed}>Logout</Dropdown.Item>
            <Dropdown.Item onClick={handleAboutPressed}>About</Dropdown.Item>
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
  const [versions, setVersions] =
    useState<{ [serviceName: string]: string }>(versionInitialValue);
  const [aboutIsOpen, setAboutIsOpen] = useState(false);
  const roles = authDetails?.currentAuthenticatedUser?.groups || [];

  useEffect(() => {
    const subscription = versionServiceInstance.subscribe((value) =>
      setVersions(value),
    );
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <Modal open={aboutIsOpen} onClose={() => setAboutIsOpen(false)} closeIcon>
        <Modal.Header>About</Modal.Header>
        <Modal.Content>
          <List>
            <List.Item as='a' href='https://github.com/danielemery'>
              <Icon name='github' /> Created by Daniel Emery
            </List.Item>
            <List.Item>
              <Icon name='copyright outline' /> Stingy Vegan, 2021
            </List.Item>
            {Object.entries(versions).map(([serviceName, version]) => (
              <List.Item key={serviceName}>
                <Label size='large'>
                  {serviceName}
                  <Label.Detail>
                    <Icon name='code branch' /> {version}
                  </Label.Detail>
                </Label>
              </List.Item>
            ))}
          </List>
        </Modal.Content>
      </Modal>
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
            handleLogoutPressed={handleLogout}
            handleAboutPressed={() => setAboutIsOpen(true)}
            name={authDetails?.currentAuthenticatedUser?.name}
            authState={authDetails.authState}
          />
        )}
      </Menu>
    </>
  );
}
export default Header;
