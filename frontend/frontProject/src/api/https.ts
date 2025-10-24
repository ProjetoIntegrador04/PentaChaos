// src/api/https.ts
import axios from "axios";
import { getStoredToken, getStoredRefreshToken, isValidJwt, clearAuth } from "../auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
  withCredentials: false,
});

// Request: injeta Bearer
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && isValidJwt(token)) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: tenta refresh no 401
let refreshing = false;
let queue: Array<() => void> = [];

async function refreshToken() {
  if (refreshing) {
    await new Promise<void>((res) => queue.push(res));
    return;
  }
  refreshing = true;
  try {
    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) throw new Error("No refresh token");
    const res = await axios.post(
      `${api.defaults.baseURL}/auth/refresh`,
      { refreshToken }
    );
    const { accessToken, refreshToken: newRefreshToken } = res.data;
    // Salva nos mesmos storages (local ou session) em que estavam
    if (localStorage.getItem("refreshToken")) {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
    } else {
      sessionStorage.setItem("token", accessToken);
      sessionStorage.setItem("refreshToken", newRefreshToken);
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
        // repete a request original
        const cfg = error.config;
        return api(cfg);
      } catch {
        clearAuth();
        // redireciono opcionalmente:
        // window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
