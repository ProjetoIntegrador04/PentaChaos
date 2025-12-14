/**
 * Constantes da aplicação
 */

// ⚠️ IMPORTANTE: Configuração da URL da API
// - Para simulador/web: usa localhost:8080
// - Para dispositivo físico: use o IP da sua máquina (ex: 192.168.1.100:8080)
// - Em produção: usa a variável de ambiente EXPO_PUBLIC_API_URL

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

// Endpoints da API (ATUALIZADOS para /api/v1)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    REFRESH: '/api/v1/auth/refresh',
  },
  CLOCKENTRY: {
    BASE: '/api/v1/clockentries',
    BY_ID: (id: number) => `/api/v1/clockentries/${id}`,
    ME_TODAY: '/api/v1/clockentries/me/today',
    ME_HISTORY: '/api/v1/clockentries/me/history',
    USER_TODAY: (userId: number) => `/api/v1/clockentries/users/${userId}/today`,
  },
  TASKS: {
    BASE: '/api/v1/tasks',
    BY_ID: (id: number) => `/api/v1/tasks/${id}`,
  },
  USERS: {
    BASE: '/api/v1/users',
    BY_ID: (id: number) => `/api/v1/users/${id}`,
  },
};

// Chaves do SecureStore
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
};

// Timeouts
export const TIMEOUTS = {
  API_REQUEST: 10000, // 10 segundos
  LOCATION: 5000, // 5 segundos
};
