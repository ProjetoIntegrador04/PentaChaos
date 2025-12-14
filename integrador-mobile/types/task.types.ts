/**
 * Tipos relacionados a tarefas (Tasks)
 */

export type TaskStatus = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
export type TaskPriority = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';

export interface TaskUser {
  id: number;
  username: string;
  fullName: string;
  email: string;
}

export interface Task {
  id?: number;
  titulo: string;
  descricao: string;
  status: TaskStatus;
  prioridade: TaskPriority;
  responsavel: TaskUser | string; // Pode ser objeto User ou string
  dataCriacao?: string;
  dataConclusao?: string;
}

export interface TaskCreateRequest {
  titulo: string;
  descricao: string;
  status?: TaskStatus;
  prioridade: TaskPriority;
  responsavel: { id: number } | string; // Pode ser objeto com id ou string
  dataConclusao?: string;
}

export interface TaskUpdateRequest {
  titulo?: string;
  descricao?: string;
  status?: TaskStatus;
  prioridade?: TaskPriority;
  responsavel?: { id: number } | string; // Pode ser objeto com id ou string
  dataConclusao?: string;
}

export interface TaskStats {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  cancelledTasks: number;
}
