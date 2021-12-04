import { Auth } from '@aws-amplify/auth';
import { BehaviorSubject } from 'rxjs';
import { RoleName } from '../types/role.types';

Auth.configure({
  region: window.env.AWS_REGION,
  userPoolId: window.env.COGNITO_USER_POOL_ID,
  userPoolWebClientId: window.env.COGNITO_USER_POOL_WEB_CLIENT_ID,
});

export type AuthState =
  | 'logged_in'
  | 'logged_out'
  | 'loading'
  | 'new_password_required'
  | 'confirmation_required';

export interface CurrentAuthenticatedUser {
  name: string;
  isEmailVerified: boolean;
  groups: RoleName[];
}

export interface AuthDetails {
  authState: AuthState;
  currentAuthenticatedUser?: CurrentAuthenticatedUser;
  currentEmail?: string;
  authenticationErrors: string[];
}

export const authInitialValue: AuthDetails = {
  authState: 'loading',
  currentAuthenticatedUser: undefined,
  currentEmail: undefined,
  authenticationErrors: [],
};

export class AuthService {
  private authSubject: BehaviorSubject<AuthDetails>;
  private internalAuthDetails: any;

  constructor() {
    this.authSubject = new BehaviorSubject<AuthDetails>(authInitialValue);

    this.handleLoggedIn = this.handleLoggedIn.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleCompleteAccount = this.handleCompleteAccount.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.initialise = this.initialise.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.getBearerToken = this.getBearerToken.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  private handleStateChange(changes: AuthDetails) {
    const newState = {
      ...this.authSubject.getValue(),
      ...changes,
    };
    this.authSubject.next(newState);
  }
  private async handleLoggedIn(user: any) {
    const details = await Auth.currentUserInfo();
    const authenticatedUser: CurrentAuthenticatedUser = {
      name: details.attributes.name,
      isEmailVerified: details?.attributes?.email_verified || false,
      groups:
        user?.signInUserSession?.accessToken?.payload?.['cognito:groups'] || [],
    };
    this.handleStateChange({
      authState: 'logged_in',
      currentAuthenticatedUser: authenticatedUser,
      currentEmail: details.attributes.email,
      authenticationErrors: [],
    });
  }
  subscribe(observer: (value: AuthDetails) => void) {
    return this.authSubject.subscribe({
      next: observer,
    });
  }
  async handleLogout() {
    await Auth.signOut();
  }
  async initialise() {
    this.handleStateChange(authInitialValue);
    try {
      const user = await Auth.currentAuthenticatedUser();
      this.handleLoggedIn(user);
    } catch (err) {
      if (err === 'The user is not authenticated') {
        this.handleStateChange({
          authState: 'logged_out',
          currentAuthenticatedUser: undefined,
          authenticationErrors: [],
          currentEmail: undefined,
        });
      } else {
        throw err;
      }
    }
  }
  async handleSignIn(email: string, password: string) {
    this.handleStateChange(authInitialValue);
    const sanitisedEmail = email.toLowerCase().trim();
    try {
      const user = await Auth.signIn(sanitisedEmail, password);
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        this.internalAuthDetails = user;
        this.handleStateChange({
          authState: 'new_password_required',
          currentAuthenticatedUser: undefined,
          currentEmail: sanitisedEmail,
          authenticationErrors: [],
        });
      } else {
        await this.handleLoggedIn(user);
      }
    } catch (err) {
      if (err instanceof Object) {
        const castError = err as any;
        if (castError?.code === 'UserNotConfirmedException') {
          this.handleStateChange({
            authState: 'confirmation_required',
            authenticationErrors: [],
            currentAuthenticatedUser: undefined,
            currentEmail: sanitisedEmail,
          });
        } else if (castError?.code === 'PasswordResetRequiredException') {
          this.handleStateChange({
            authState: 'new_password_required',
            authenticationErrors: [],
            currentAuthenticatedUser: undefined,
            currentEmail: sanitisedEmail,
          });
        } else {
          this.handleStateChange({
            authState: 'logged_out',
            authenticationErrors: [
              castError?.message || 'Unexpected error occurred',
            ],
            currentAuthenticatedUser: undefined,
            currentEmail: undefined,
          });
        }
      } else {
        this.handleStateChange({
          authState: 'logged_out',
          authenticationErrors: ['Unexpected error occurred'],
          currentAuthenticatedUser: undefined,
          currentEmail: undefined,
        });
      }
    }
  }
  async handleCompleteAccount(name: string, password: string) {
    this.handleStateChange({
      ...authInitialValue,
      currentEmail: this.authSubject.getValue().currentEmail,
    });
    try {
      await Auth.completeNewPassword(this.internalAuthDetails, password, {
        name,
      });
      const details = await Auth.currentUserInfo();
      this.handleLoggedIn(details);
    } catch (err) {
      if (err instanceof Object) {
        const castError = err as any;
        this.handleStateChange({
          authState: 'logged_out',
          authenticationErrors: [
            castError?.message || 'Unexpected error occurred',
          ],
          currentAuthenticatedUser: undefined,
          currentEmail: undefined,
        });
      } else {
        this.handleStateChange({
          authState: 'logged_out',
          authenticationErrors: ['Unexpected error occurred'],
          currentAuthenticatedUser: undefined,
          currentEmail: undefined,
        });
      }
    }
  }
  public async getBearerToken() {
    const session = await Auth.currentSession();
    return session.getAccessToken().getJwtToken();
  }
}

const authServiceInstance = new AuthService();
authServiceInstance.initialise();
export default authServiceInstance;
