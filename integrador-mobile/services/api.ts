/**
 * Configuração centralizada do Axios para comunicação com o backend
 * VERSÃO SIMPLIFICADA - SEM REFRESH AUTOMÁTICO (para debug)
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
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

/**
 * Interceptor de REQUEST - Adiciona token em TODAS as requisições
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Pega o token do storage
      const token = await secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      
      console.log('═══════════════════════════════════════');
      console.log('📤 REQUEST INTERCEPTOR');
      console.log('   Método:', config.method?.toUpperCase());
      console.log('   URL:', config.url);
      console.log('   Token existe?', token ? 'SIM' : 'NÃO');
      
      if (token) {
        console.log('   Token (primeiros 30 chars):', token.substring(0, 30) + '...');
        config.headers.Authorization = `Bearer ${token}`;
        console.log('   ✅ Authorization header definido');
      } else {
        console.log('   ⚠️ NENHUM TOKEN ENCONTRADO!');
      }
      
      console.log('═══════════════════════════════════════');
      
      return config;
    } catch (error) {
      console.error('❌ ERRO NO REQUEST INTERCEPTOR:', error);
      return config;
    }
  },
  (error) => {
    console.error('❌ ERRO NO REQUEST INTERCEPTOR (reject):', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de RESPONSE - Trata erros
 */
api.interceptors.response.use(
  (response) => {
    console.log('═══════════════════════════════════════');
    console.log('✅ RESPONSE SUCCESS');
    console.log('   Status:', response.status);
    console.log('   URL:', response.config.url);
    console.log('═══════════════════════════════════════');
    return response;
  },
  async (error: AxiosError) => {
    console.log('═══════════════════════════════════════');
    console.log('❌ RESPONSE ERROR');
    console.log('   Status:', error.response?.status);
    console.log('   URL:', error.config?.url);
    console.log('   Mensagem:', error.message);
    
    if (error.response) {
      console.log('   Data do servidor:', error.response.data);
      console.log('   Headers da resposta:', error.response.headers);
    }
    
    console.log('═══════════════════════════════════════');
    
    // NÃO redireciona automaticamente - deixa a tela tratar o erro
    // A tela vai mostrar mensagem apropriada e decidir se redireciona ou não
    
    return Promise.reject(error);
  }
);

export default api;
