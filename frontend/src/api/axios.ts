import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3002/api",
  withCredentials: true,
});

/** Do not attach refresh-retry to these (avoid loops / pre-auth). `/auth/me` is not listed so expired access can refresh. */
const AUTH_SKIP_URLS = [
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
        // Session bootstrap: stay on page and let callers treat as logged out.
        if (!requestUrl.includes("/auth/me")) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
