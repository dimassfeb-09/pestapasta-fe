// Semua konfigurasi API diatur via environment variable (VITE_API_BASE_URL).
// Fallback ke variabel lama / default untuk kompatibilitas.
const API_MODE = import.meta.env.VITE_API_MODE ?? "production";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (API_MODE === "production"
    ? import.meta.env.VITE_ENDPOINT_BACKEND_PRODUCTION
    : import.meta.env.VITE_ENDPOINT_BACKEND_LOCAL) ||
  "/api";

interface API {
  baseURL: string;
}

export const api = (): API => {
  return {
    baseURL: API_BASE_URL.replace(/\/+$/, ""),
  };
};