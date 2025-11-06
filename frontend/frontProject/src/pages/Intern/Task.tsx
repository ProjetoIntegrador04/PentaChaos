import React, { useState } from 'react';
import { Play, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import '../../styles/Intern/Task.css'; // CSS específico para o Kanban do Estagiário

// --- Tipos ---
type TaskStatus = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA";
type TaskPriority = "Alta" | "Media" | "Baixa";

interface Task {
  id: number;
  titulo: string;
  descricao: string;
  status: TaskStatus;
  prioridade: TaskPriority;
  dataPrazo?: string;
}

// --- Dados Mocado (Apenas tarefas do "Pablo") ---
const mockMyTasks: Task[] = [
  { id: 1, titulo: "Ajustar CSS da Home", descricao: "Alinhar os widgets conforme o novo design.", status: "EM_ANDAMENTO", prioridade: "Alta", dataPrazo: "2025-11-05" },
  { id: 2, titulo: "Testar fluxo de login", descricao: "Garantir que o redirecionamento por role está funcionando.", status: "PENDENTE", prioridade: "Media", dataPrazo: "2025-11-06" },
  { id: 3, titulo: "Criar componentes de UI", descricao: "Botões e inputs padronizados.", status: "CONCLUIDA", prioridade: "Baixa", dataPrazo: "2025-11-01" },
  { id: 4, titulo: "Revisar documentação", descricao: "Ler a nova wiki do projeto.", status: "PENDENTE", prioridade: "Baixa" },
];

const KANBAN_COLUMNS: { id: TaskStatus; title: string; icon: React.ElementType }[] = [
  { id: "PENDENTE", title: "A Fazer", icon: AlertCircle },
  { id: "EM_ANDAMENTO", title: "Em Progresso", icon: Clock },
  { id: "CONCLUIDA", title: "Concluído", icon: CheckCircle },
];

const InternTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockMyTasks);

  // Função para avançar o status da tarefa
  const advanceTaskStatus = (taskId: number, currentStatus: TaskStatus) => {
    let newStatus: TaskStatus = currentStatus;
    if (currentStatus === "PENDENTE") newStatus = "EM_ANDAMENTO";
    else if (currentStatus === "EM_ANDAMENTO") newStatus = "CONCLUIDA";

    if (newStatus !== currentStatus) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    }
  };

  const tasksByColumn = (status: TaskStatus) => tasks.filter(t => t.status === status);

  return (
    <div className="intern-tasks-page">
      <header className="intern-tasks-header">
        <h1>Minhas Atividades</h1>
      </header>

      <div className="kanban-board">
        {KANBAN_COLUMNS.map(column => {
          const ColumnIcon = column.icon;
          return (
            <div key={column.id} className={`kanban-column column-${column.id.toLowerCase()}`}>
              <div className="column-header">
                <div className="column-title-group">
                  <ColumnIcon size={18} />
                  <h2>{column.title}</h2>
                </div>
                <span className="task-count">{tasksByColumn(column.id).length}</span>
              </div>
              
              <div className="kanban-list">
                {tasksByColumn(column.id).map(task => (
                  <div key={task.id} className={`kanban-card priority-${task.prioridade.toLowerCase()}`}>
                    <div className="card-badges">
                      <span className={`priority-badge ${task.prioridade.toLowerCase()}`}>
                        {task.prioridade}
                      </span>
                      {task.dataPrazo && <span className="date-badge">{new Date(task.dataPrazo).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}</span>}
                    </div>
                    
                    <h3 className="card-title">{task.titulo}</h3>
                    <p className="card-desc">{task.descricao}</p>

                    {/* Botões de Ação Rápida */}
                    <div className="card-actions">
                      {task.status === "PENDENTE" && (
                        <button className="action-btn start-btn" onClick={() => advanceTaskStatus(task.id, task.status)}>
                          <Play size={14} /> Iniciar
                        </button>
                      )}
                      {task.status === "EM_ANDAMENTO" && (
                        <button className="action-btn finish-btn" onClick={() => advanceTaskStatus(task.id, task.status)}>
                          <CheckCircle size={14} /> Concluir
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InternTasks;