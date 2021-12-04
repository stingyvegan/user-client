import { PropsWithChildren, useEffect, useState } from 'react';

import {
  AuthService,
  AuthDetails,
  authInitialValue,
} from '../auth/auth.service';
import AuthContext, { AuthContextValue } from '../contexts/Auth.context';

export type AuthContextProviderProps = PropsWithChildren<{
  authInstance: AuthService;
}>;

export default function AuthContextProvider({
  authInstance,
  children,
}: AuthContextProviderProps) {
  const [authState, setAuthState] = useState<AuthDetails>(authInitialValue);

  useEffect(() => {
    const subscription = authInstance.subscribe((authDetails: AuthDetails) => {
      setAuthState(authDetails);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [authInstance]);

  const authContextValue: AuthContextValue = {
    authDetails: authState,
    handleSignIn: authInstance.handleSignIn,
    handleCompleteAccount: authInstance.handleCompleteAccount,
  }; 

  return (
    <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>
  );
}
