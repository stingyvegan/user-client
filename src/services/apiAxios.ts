import axios from 'axios';

import authServiceInstance from '../auth/auth.service';

const baseURL = `${window.env.API_URI}`;

async function getAxios() {
  const bearerToken = await authServiceInstance.getBearerToken();
  const configured = axios.create({
    baseURL,
    headers: {
      authorization: `Bearer ${bearerToken}`,
    },
  });
  return configured;
}

export default getAxios;
