import { PropsWithChildren, useEffect, useState } from "react";

import {
  AuthService,
  AuthDetails,
  authInitialValue,
} from "../auth/auth.service";
import AuthContext from "../contexts/Auth.context";

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
      console.log(authDetails);
      setAuthState(authDetails);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [authInstance]);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}
