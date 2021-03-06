import { DockerCRABaseEnvType } from 'docker-cra';

interface IEnvValues extends DockerCRABaseEnvType {
  AWS_REGION: string;
  COGNITO_USER_POOL_ID: string;
  COGNITO_USER_POOL_WEB_CLIENT_ID: string;
  API_URI: string;
  WS_URI: string;
  GOOGLE_ANALYTICS_ID: string;
}

export declare global {
  interface Window {
    env: IEnvValues;
    ga: any;
  }
}
