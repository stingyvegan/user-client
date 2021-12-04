import { DockerCRABaseEnvType } from 'docker-cra';

interface IEnvValues extends DockerCRABaseEnvType {}

export declare global {
  interface Window {
    env: IEnvValues;
  }
}
