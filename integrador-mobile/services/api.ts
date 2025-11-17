/**
 * Configuração centralizada do Axios para comunicação com o backend
 */

import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, STORAGE_KEYS, TIMEOUTS } from '../utils/constants';
import { secureStorage } from '../utils/storage';
import { router } from 'expo-router';

// Cria instância do Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUTS.API_REQUEST,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag para evitar múltiplas tentativas de refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Interceptor de REQUEST
 * Adiciona o token JWT em todas as requisições
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`📤 API REQUEST: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Erro no interceptor de request:', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de RESPONSE
 * Trata erros e faz refresh automático do token quando expira
 */
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API RESPONSE: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Se o erro é 401 e ainda não tentou fazer refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Se já está fazendo refresh, adiciona na fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await secureStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

        if (!refreshToken) {
          throw new Error('Refresh token não encontrado');
        }

        // Tenta fazer refresh do token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Salva os novos tokens
        await secureStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        await secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

        // Processa fila de requisições que falharam
        processQueue(null, accessToken);

        // Refaz a requisição original com o novo token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Se falhou ao fazer refresh, desloga o usuário
        processQueue(refreshError as Error, null);
        await secureStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        await secureStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        await secureStorage.removeItem(STORAGE_KEYS.USER_DATA);

        // Redireciona para login
        router.replace('/');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Log de erro detalhado
    if (error.response) {
      console.error(`❌ API ERROR ${error.response.status}:`, {
        url: error.config?.url,
        method: error.config?.method,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error('❌ Sem resposta do servidor:', error.message);
    } else {
      console.error('❌ Erro na requisição:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
