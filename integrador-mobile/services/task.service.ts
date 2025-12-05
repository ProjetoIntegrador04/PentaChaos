/**
 * Serviço de Tarefas (Tasks)
 * Gerencia CRUD de tarefas e cards
 */

import api from './api';
import { API_ENDPOINTS } from '../utils/constants';
import {
  Task,
  TaskCreateRequest,
  TaskUpdateRequest,
  TaskStatus,
} from '../types/task.types';

class TaskService {
  /**
   * Busca todas as tarefas do usuário
   */
  async getAllTasks(): Promise<Task[]> {
    try {
      const response = await api.get<Task[]>(API_ENDPOINTS.TASKS.BASE);
      console.log(`✅ ${response.data.length} tarefas carregadas`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar tarefas:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Busca uma tarefa específica por ID
   */
  async getTaskById(id: number): Promise<Task> {
    try {
      const response = await api.get<Task>(API_ENDPOINTS.TASKS.BY_ID(id));
      console.log(`✅ Tarefa ${id} carregada`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao buscar tarefa ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Cria uma nova tarefa (apenas ADMIN)
   */
  async createTask(task: TaskCreateRequest): Promise<Task> {
    try {
      const response = await api.post<Task>(API_ENDPOINTS.TASKS.BASE, task);
      console.log('✅ Tarefa criada com sucesso:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar tarefa:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Atualiza uma tarefa existente (apenas ADMIN)
   */
  async updateTask(id: number, task: TaskUpdateRequest): Promise<Task> {
    try {
      const response = await api.put<Task>(API_ENDPOINTS.TASKS.BY_ID(id), task);
      console.log(`✅ Tarefa ${id} atualizada com sucesso`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao atualizar tarefa ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Deleta uma tarefa (apenas ADMIN)
   */
  async deleteTask(id: number): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.TASKS.BY_ID(id));
      console.log(`✅ Tarefa ${id} deletada com sucesso`);
    } catch (error: any) {
      console.error(`❌ Erro ao deletar tarefa ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Filtra tarefas por status
   */
  filterTasksByStatus(tasks: Task[], status: TaskStatus): Task[] {
    return tasks.filter((task) => task.status === status);
  }

  /**
   * Filtra tarefas pendentes
   */
  getPendingTasks(tasks: Task[]): Task[] {
    return this.filterTasksByStatus(tasks, 'PENDENTE');
  }

  /**
   * Filtra tarefas em andamento
   */
  getInProgressTasks(tasks: Task[]): Task[] {
    return this.filterTasksByStatus(tasks, 'EM_ANDAMENTO');
  }

  /**
   * Filtra tarefas concluídas
   */
  getCompletedTasks(tasks: Task[]): Task[] {
    return this.filterTasksByStatus(tasks, 'CONCLUIDA');
  }

  /**
   * Formata o status para exibição
   */
  formatarStatus(status: TaskStatus): string {
    const statusMap: Record<TaskStatus, string> = {
      PENDENTE: 'Pendente',
      EM_ANDAMENTO: 'Em Andamento',
      CONCLUIDA: 'Concluída',
      CANCELADA: 'Cancelada',
    };
    return statusMap[status] || status;
  }

  /**
   * Retorna a cor do status
   */
  getStatusColor(status: TaskStatus): string {
    const colorMap: Record<TaskStatus, string> = {
      PENDENTE: '#FFA500', // Laranja
      EM_ANDAMENTO: '#0A4A8E', // Azul
      CONCLUIDA: '#28a745', // Verde
      CANCELADA: '#dc3545', // Vermelho
    };
    return colorMap[status] || '#999';
  }
}

export default new TaskService();
