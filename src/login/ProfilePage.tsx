import React, { Fragment, useContext } from 'react';
import { Loader, Message } from 'semantic-ui-react';

import AuthContext from '../contexts/Auth.context';

import { getRoles } from '../helpers/cognito';

import Login from './Login';
import CompleteAccount from './CompleteAccount';
import Account from './Account';

function Profile() {
  const { authDetails, handleSignIn, handleCompleteAccount } = useContext(AuthContext);

  let signInComponent = <Login loading={false} onSignIn={handleSignIn} />;
  switch (authDetails.authState) {
    case 'logged_out':
      break;
    case 'new_password_required':
      signInComponent = (
        <CompleteAccount
          loading={false}
          onCompleteAccount={handleCompleteAccount}
        />
      );
      break;
    case 'logged_in':
      signInComponent = (
        <Account
          loading={false}
          name={authDetails!.currentAuthenticatedUser!.name}
          roles={getRoles(authDetails!.currentAuthenticatedUser!.groups)}
        />
      );
      break;
    case 'loading':
      signInComponent = <Loader />;
      break;
    default:
      console.error(`unknown state: ${authDetails.authState}`);
  }
  return (
    <Fragment>
      {authDetails.authenticationErrors.map((err) => (
        <Message key={err} negative>
          {err}
        </Message>
      ))}
      {signInComponent}
    </Fragment>
  );
}

export default Profile;
