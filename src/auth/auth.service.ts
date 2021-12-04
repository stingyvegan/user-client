import { Auth } from '@aws-amplify/auth';
import { BehaviorSubject } from 'rxjs';

Auth.configure({
  region: window.env.AWS_REGION,
  userPoolId: window.env.COGNITO_USER_POOL_ID,
  userPoolWebClientId: window.env.COGNITO_USER_POOL_WEB_CLIENT_ID,
});

export type AuthState = 'logged_in' | 'logged_out' | 'loading';

export interface AuthDetails {
  authState: AuthState;
  currentAuthenticatedUser: any;
}

export const authInitialValue: AuthDetails = {
  authState: 'loading',
  currentAuthenticatedUser: undefined,
};

export class AuthService {
  private authSubject: BehaviorSubject<AuthDetails>;

  constructor() {
    this.authSubject = new BehaviorSubject<AuthDetails>(authInitialValue);
  }

  private handleStateChange(changes: AuthDetails) {
    const newState = {
      ...this.authSubject.getValue(),
      ...changes,
    };
    this.authSubject.next(newState);
  }
  subscribe(observer: (value: AuthDetails) => void) {
    return this.authSubject.subscribe({
      next: observer,
    });
  }
  async logout() {
    await Auth.signOut();
  }
  async initialise() {
    this.handleStateChange({
      authState: 'loading',
      currentAuthenticatedUser: undefined,
    });
    try {
      const currentAuthenticatedUser = await Auth.currentAuthenticatedUser();
      this.handleStateChange({
        currentAuthenticatedUser,
        authState: 'logged_in',
      });
    } catch (err) {
      if (err === 'The user is not authenticated') {
        this.handleStateChange({
          authState: 'logged_out',
          currentAuthenticatedUser: undefined,
        });
      } else {
        throw err;
      }
    }
  }
}

const authServiceInstance = new AuthService();
authServiceInstance.initialise();
export default authServiceInstance;
