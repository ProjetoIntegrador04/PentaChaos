/**
 * Serviço de Squads
 * Gerencia squads e seus membros
 */

import api from './api';
import { Squad, SquadRequest, AddMemberRequest, UpdateMemberRoleRequest } from '../types/squad.types';

class SquadService {
  /**
   * Lista todos os squads
   */
  async getAllSquads(): Promise<Squad[]> {
    const response = await api.get<Squad[]>('/api/v1/squads');
    return response.data;
  }

  /**
   * Busca um squad por ID
   */
  async getSquadById(id: number): Promise<Squad> {
    const response = await api.get<Squad>(`/api/v1/squads/${id}`);
    return response.data;
  }

  /**
   * Cria um novo squad (apenas ADMIN)
   */
  async createSquad(data: SquadRequest): Promise<Squad> {
    const response = await api.post<Squad>('/api/v1/squads', data);
    return response.data;
  }

  /**
   * Atualiza um squad (apenas ADMIN)
   */
  async updateSquad(id: number, data: SquadRequest): Promise<Squad> {
    const response = await api.put<Squad>(`/api/v1/squads/${id}`, data);
    return response.data;
  }

  /**
   * Deleta um squad (apenas ADMIN)
   */
  async deleteSquad(id: number): Promise<void> {
    await api.delete(`/api/v1/squads/${id}`);
  }

  /**
   * Adiciona um membro ao squad (apenas ADMIN)
   */
  async addMember(squadId: number, data: AddMemberRequest): Promise<Squad> {
    const response = await api.post<Squad>(`/api/v1/squads/${squadId}/members`, data);
    return response.data;
  }

  /**
   * Remove um membro do squad (apenas ADMIN)
   */
  async removeMember(squadId: number, userId: number): Promise<Squad> {
    const response = await api.delete<Squad>(`/api/v1/squads/${squadId}/members/${userId}`);
    return response.data;
  }

  /**
   * Busca squads de um usuário específico
   */
  async getSquadsByUserId(userId: number): Promise<Squad[]> {
    const response = await api.get<Squad[]>(`/api/v1/squads/user/${userId}`);
    return response.data;
  }

  /**
   * Atualiza a função/role de um membro no squad (apenas ADMIN)
   */
  async updateMemberRole(squadId: number, userId: number, data: UpdateMemberRoleRequest): Promise<Squad> {
    const response = await api.put<Squad>(`/api/v1/squads/${squadId}/members/${userId}/role`, data);
    return response.data;
  }
}

export default new SquadService();
