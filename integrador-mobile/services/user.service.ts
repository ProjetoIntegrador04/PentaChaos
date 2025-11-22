/**
 * Serviço de Usuários
 * Gerencia perfil e dados do usuário
 */

import api from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { User } from '../types/auth.types';

class UserService {
  /**
   * Busca todos os usuários (apenas ADMIN)
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get<User[]>(API_ENDPOINTS.USERS.BASE);
      console.log(`✅ ${response.data.length} usuários carregados`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar usuários:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Busca um usuário específico por ID
   */
  async getUserById(id: number): Promise<User> {
    try {
      const response = await api.get<User>(API_ENDPOINTS.USERS.BY_ID(id));
      console.log(`✅ Usuário ${id} carregado`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao buscar usuário ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Busca o perfil do usuário logado
   */
  async getMyProfile(): Promise<User> {
    try {
      // Assumindo que o backend tem um endpoint /users/me
      const response = await api.get<User>('/api/v1/users/me');
      console.log('✅ Perfil do usuário carregado');
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar perfil:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Atualiza o perfil do usuário
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await api.put<User>('/api/v1/users/me', data);
      console.log('✅ Perfil atualizado com sucesso');
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao atualizar perfil:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Alterna o status de um usuário (ativo/inativo)
   */
  async toggleUserStatus(userId: number): Promise<User> {
    try {
      const response = await api.patch<User>(`/api/v1/users/${userId}/status`);
      console.log(`✅ Status do usuário ${userId} alternado`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao alterar status do usuário ${userId}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Verifica se o usuário tem role ADMIN
   */
  isAdmin(user: User): boolean {
    return user.roles.some((role) => role.name === 'ROLE_ADMIN');
  }

  /**
   * Verifica se o usuário tem role USER
   */
  isUser(user: User): boolean {
    return user.roles.some((role) => role.name === 'ROLE_USER');
  }

  /**
   * Retorna as roles do usuário formatadas
   */
  formatRoles(user: User): string {
    return user.roles.map((role) => role.name.replace('ROLE_', '')).join(', ');
  }
}

export default new UserService();
