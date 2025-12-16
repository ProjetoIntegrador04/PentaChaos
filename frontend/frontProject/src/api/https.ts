import axios, {AxiosError} from 'axios';
import type {InternalAxiosRequestConfig} from 'axios';
import {
  getStoredToken,
  getStoredRefreshToken,
  isValidJwt,
  clearAuth,
  saveRoles,
} from '../auth';

// Base da API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://sge-app.duckdns.org',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'application/json; charset=utf-8',
  },
});

// Interceptor de requisição (anexa JWT)
api.interceptors.request.use(config => {
  const token = getStoredToken();
  if (token && isValidJwt(token)) {
    config.headers = config.headers ?? {};
    (
      config.headers as Record<string, string>
    ).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Controle de refresh
let refreshing = false;
let queue: Array<(token: string | null) => void> = [];

function processQueue(token: string | null) {
  queue.forEach(callback => callback(token));
  queue = [];
}

async function refreshToken(): Promise<string | null> {
  const rt = getStoredRefreshToken();
  if (!rt) {
    console.warn('⚠️ Sem refresh token disponível');
    return null;
  }

  try {
    console.log('🔄 Tentando renovar token...');
    const res = await axios.post(
      `${api.defaults.baseURL}/api/v1/auth/refresh`,
      {
        refreshToken: rt,
      }
    );

    const {accessToken, refreshToken: newRt, roles} = res.data;

    // Atualiza token no mesmo storage onde estava o anterior
    const useLocal = !!localStorage.getItem('refreshToken');
    const storage = useLocal ? localStorage : sessionStorage;

    storage.setItem('token', accessToken);
    storage.setItem('refreshToken', newRt);

    // Atualiza roles se retornados
    if (roles) {
      saveRoles(roles, useLocal);
    }

    console.log('✅ Token renovado com sucesso!');
    return accessToken;
  } catch (err) {
    console.error('❌ Erro ao renovar token:', err);
    return null;
  }
}

// Extend AxiosRequestConfig to include _retry
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Interceptor de resposta (auto refresh no 401)
api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // Se não for 401 ou já tentou retry, rejeita
    if (error?.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    // Marca como retry para evitar loop
    originalRequest._retry = true;

    // Se já está fazendo refresh, aguarda na fila
    if (refreshing) {
      return new Promise((resolve, reject) => {
        queue.push(newToken => {
          if (newToken && originalRequest) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }

    refreshing = true;

    try {
      const newToken = await refreshToken();

      if (newToken) {
        processQueue(newToken);

        if (originalRequest) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } else {
        // Refresh falhou - limpa auth e redireciona
        processQueue(null);
        clearAuth();
        console.warn('🔒 Sessão expirada. Redirecionando para login...');
        window.location.href = '/login';
      }
    } catch (refreshError) {
      processQueue(null);
      clearAuth();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      refreshing = false;
    }

    return Promise.reject(error);
  }
);

export default api;
