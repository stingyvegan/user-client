import { BehaviorSubject } from 'rxjs';

export const versionInitialValue = {
  'user-client': window.env.REACT_APP_CLIENT_VERSION,
};

export interface VersionDetails {
  [serviceName: string]: string;
}

export class VersionService {
  private versionSubject: BehaviorSubject<VersionDetails>;

  constructor() {
    this.versionSubject = new BehaviorSubject<VersionDetails>(
      versionInitialValue,
    );
  }

  public handleVersionInfo(serviceName: string, version: string) {
    const currentState = this.versionSubject.getValue();
    if (currentState[serviceName] !== version) {
      const newState = {
        ...currentState,
        [serviceName]: version,
      };
      this.versionSubject.next(newState);
    }
  }

  subscribe(observer: (value: VersionDetails) => void) {
    return this.versionSubject.subscribe({
      next: observer,
    });
  }
}

const versionServiceInstance = new VersionService();
export default versionServiceInstance;
