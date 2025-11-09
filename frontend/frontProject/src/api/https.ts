import axios from "axios";
import { getStoredToken, getStoredRefreshToken, isValidJwt, clearAuth } from "../auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && isValidJwt(token)) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshing = false;
let queue: Array<() => void> = [];

async function refreshToken() {
  if (refreshing) {
    await new Promise<void>((res) => queue.push(res));
    return;
  }
  refreshing = true;
  try {
    const rt = getStoredRefreshToken();
    if (!rt) throw new Error("No refresh token");
    const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken: rt });
    const { accessToken, refreshToken: newRt } = res.data;

    // mantém no mesmo storage (local vs session) onde já está o refresh atual
    if (localStorage.getItem("refreshToken")) {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", newRt);
    } else {
      sessionStorage.setItem("token", accessToken);
      sessionStorage.setItem("refreshToken", newRt);
    }
  } finally {
    refreshing = false;
    queue.forEach((fn) => fn());
    queue = [];
  }
}

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    if (error?.response?.status === 401) {
      try {
        await refreshToken();
        return api(error.config);
      } catch {
        clearAuth();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
