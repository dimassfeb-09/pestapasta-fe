// const API_LOCAL = import.meta.env.VITE_ENDPOINT_BACKEND_LOCAL;
const API_PRODUCTION = import.meta.env.VITE_ENDPOINT_BACKEND_PRODUCTION;

interface API {
  baseURL: string;
}

export const api = (): API => {
  const baseURL = API_PRODUCTION;

  return {
    baseURL,
  };
};
