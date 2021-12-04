import React from 'react';
import { AuthDetails, authInitialValue } from '../auth/auth.service';

export type AuthContextValue = {
  authDetails: AuthDetails;
  handleSignIn: (email: string, password: string) => void;
  handleCompleteAccount: (name: string, password: string) => void;
};

const AuthContext = React.createContext<AuthContextValue>({
  authDetails: authInitialValue,
  handleSignIn: () => {
    throw new Error('onSignIn called before initialisation');
  },
  handleCompleteAccount: () => {
    throw new Error('handleCompleteAccount called before initialisation');
  },
});
export default AuthContext;
