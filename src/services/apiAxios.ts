import axios from 'axios';

import authServiceInstance from '../auth/auth.service';
import versionServiceInstance from './version.service';

const baseURL = `${window.env.API_URI}`;
const VERSION_HEADER = 'x-sv-api-version';

async function getAxios() {
  const bearerToken = await authServiceInstance.getBearerToken();
  const configured = axios.create({
    baseURL,
    headers: {
      authorization: `Bearer ${bearerToken}`,
    },
  });
  configured.interceptors.response.use(function (response) {
    if (response.headers[VERSION_HEADER]) {
      versionServiceInstance.handleVersionInfo(
        'sv-api',
        response.headers[VERSION_HEADER],
      );
    }
    return response;
  });
  return configured;
}

export default getAxios;
