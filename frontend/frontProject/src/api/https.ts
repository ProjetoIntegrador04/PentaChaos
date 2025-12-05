import axios from "axios";
import {
  getStoredToken,
  getStoredRefreshToken,
  isValidJwt,
  clearAuth,
} from "../auth";

// Base da API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor de requisição (anexa JWT)
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && isValidJwt(token)) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Controle de refresh
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
    if (!rt) throw new Error("Sem refresh token válido");

    const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
      refreshToken: rt,
    });

    const { accessToken, refreshToken: newRt } = res.data;

    // Atualiza token no mesmo storage onde estava o anterior
    const useLocal = !!localStorage.getItem("refreshToken");
    const storage = useLocal ? localStorage : sessionStorage;

    storage.setItem("token", accessToken);
    storage.setItem("refreshToken", newRt);
  } catch (err) {
    console.error("Erro ao atualizar token:", err);
    clearAuth(); // limpa e força logout
  } finally {
    refreshing = false;
    queue.forEach((fn) => fn());
    queue = [];
  }
}

// Interceptor de resposta (auto refresh no 401)
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const originalRequest = error.config;

    // Evita loop de refresh
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshToken();
        const newToken = getStoredToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch {
        clearAuth();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
