import React from "react";
import { AuthDetails, authInitialValue } from "../auth/auth.service";

const AuthContext = React.createContext<AuthDetails>(authInitialValue);
export default AuthContext;
