/**
 * Serviço de Autenticação
 * Gerencia login, logout, registro e refresh de tokens
 */

import api from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';
import { secureStorage, localStorage } from '../utils/storage';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from '../types/auth.types';

class AuthService {
  /**
   * Faz login do usuário
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      const { accessToken, refreshToken } = response.data;

      // Salva tokens de forma segura
      await secureStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      await secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

      console.log('✅ Login realizado com sucesso');
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro no login:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Registra um novo usuário
   */
  async register(data: RegisterRequest): Promise<User> {
    try {
      const response = await api.post<User>(API_ENDPOINTS.AUTH.REGISTER, data);
      console.log('✅ Usuário registrado com sucesso');
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro no registro:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Faz logout do usuário
   */
  async logout(): Promise<void> {
    try {
      // Remove todos os dados de autenticação
      await secureStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      await secureStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      await secureStorage.removeItem(STORAGE_KEYS.USER_DATA);
      await localStorage.clear();

      console.log('✅ Logout realizado com sucesso');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      throw error;
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      return !!token;
    } catch (error) {
      console.error('❌ Erro ao verificar autenticação:', error);
      return false;
    }
  }

  /**
   * Obtém o access token atual
   */
  async getAccessToken(): Promise<string | null> {
    try {
      return await secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('❌ Erro ao obter access token:', error);
      return null;
    }
  }

  /**
   * Obtém o refresh token atual
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      return await secureStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('❌ Erro ao obter refresh token:', error);
      return null;
    }
  }

  /**
   * Salva dados do usuário localmente
   */
  async saveUserData(user: User): Promise<void> {
    try {
      await secureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      console.log('✅ Dados do usuário salvos');
    } catch (error) {
      console.error('❌ Erro ao salvar dados do usuário:', error);
      throw error;
    }
  }

  /**
   * Obtém dados do usuário salvos localmente
   */
  async getUserData(): Promise<User | null> {
    try {
      const userData = await secureStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('❌ Erro ao obter dados do usuário:', error);
      return null;
    }
  }

  /**
   * Faz refresh do access token
   */
  async refreshAccessToken(): Promise<LoginResponse> {
    try {
      const refreshToken = await this.getRefreshToken();

      if (!refreshToken) {
        throw new Error('Refresh token não encontrado');
      }

      const response = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.REFRESH, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      // Atualiza os tokens
      await secureStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      await secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

      console.log('✅ Token atualizado com sucesso');
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao fazer refresh:', error.response?.data || error.message);
      // Se falhar, desloga o usuário
      await this.logout();
      throw error;
    }
  }
}

export default new AuthService();
