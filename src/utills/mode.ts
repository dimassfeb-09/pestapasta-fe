// const API_LOCAL = import.meta.env.VITE_ENDPOINT_BACKEND_LOCAL;
const API_MODE = import.meta.env.VITE_API_MODE;
const API_PRODUCTION = import.meta.env.VITE_ENDPOINT_BACKEND_PRODUCTION;
const API_LOCAL = import.meta.env.VITE_ENDPOINT_BACKEND_LOCAL;

interface API {
  baseURL: string;
}

export const api = (): API => {
  const baseURL = API_MODE == "production" ? API_PRODUCTION : API_LOCAL;
  return {
    baseURL,
  };
};
