/**
 * Tipos relacionados a tarefas (Tasks)
 */

export type TaskStatus = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
export type TaskPriority = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';

export interface Task {
  id?: number;
  titulo: string;
  descricao: string;
  status: TaskStatus;
  prioridade: TaskPriority;
  responsavel: string;
  dataCriacao?: string;
  dataConclusao?: string;
}

export interface TaskCreateRequest {
  titulo: string;
  descricao: string;
  status?: TaskStatus;
  prioridade: TaskPriority;
  responsavel: string;
  dataConclusao?: string;
}

export interface TaskUpdateRequest {
  titulo?: string;
  descricao?: string;
  status?: TaskStatus;
  prioridade?: TaskPriority;
  responsavel?: string;
  dataConclusao?: string;
}

export interface TaskStats {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  cancelledTasks: number;
}
