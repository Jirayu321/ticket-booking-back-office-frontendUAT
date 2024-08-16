import axios from "axios";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL;

const authAxiosClient = axios.create();

authAxiosClient.interceptors.request.use((config) => {
  config.headers["x-api-key"] = import.meta.env.VITE_API_KEY;
  config.baseURL = ENDPOINT;
  return config;
});

export { authAxiosClient };
