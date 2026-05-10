import axios from "axios";

const { VITE_API_URL } = import.meta.env;
if (typeof VITE_API_URL !== "string" || !VITE_API_URL.trim()) {
  throw new Error(
    "VITE_API_URL is required. For local dev, copy frontend/.env.example to frontend/.env. On Vercel, set VITE_API_URL in project env settings.",
  );
}

const api = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true,
});

const AUTH_SKIP_URLS = [
  "/auth/me",
  "/auth/refresh-token",
  "/auth/login",
  "/auth/logout",
];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl: string = originalRequest?.url ?? "";

    const isAuthEndpoint = AUTH_SKIP_URLS.some((u) => requestUrl.includes(u));

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        console.log(
          "[Axios Interceptor] Access token expired, attempting refresh...",
        );
        await api.post("/auth/refresh-token");
        console.log(
          "[Axios Interceptor] Token refreshed successfully, retrying original request",
        );
        return api(originalRequest);
      } catch (refreshError) {
        console.error(
          "[Axios Interceptor] Token refresh failed:",
          refreshError,
        );
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
