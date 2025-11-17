/**
 * Constantes da aplicação
 */

// ⚠️ IMPORTANTE: Alterar para o IP da sua máquina!
// Para descobrir:
// Windows: ipconfig
// Mac/Linux: ifconfig
// Procurar pelo IPv4 da rede Wi-Fi (ex: 192.168.1.100)

export const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://192.168.1.100:8080'  // ← ALTERAR ESTE IP!
  : 'https://sua-api-producao.com';

// Endpoints da API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
  },
  CLOCKENTRY: {
    BASE: '/api/v1/clockentries',
    BY_ID: (id: number) => `/api/v1/clockentries/${id}`,
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
