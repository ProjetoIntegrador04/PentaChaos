import React, { useState, useMemo } from 'react';
// 1. Adicionado Undo2 para o botão de voltar
import { Play, CheckCircle, Clock, AlertCircle, ChevronLeft, ChevronRight, Calendar, Undo2 } from 'lucide-react';
import '../../styles/Intern/Task.css';

// --- Tipos (sem alteração) ---
type TaskStatus = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA";
type TaskPriority = "Alta" | "Media" | "Baixa";
type FilterMode = 'all' | 'month' | 'week';

interface Task {
  id: number;
  titulo: string;
  descricao: string;
  status: TaskStatus;
  prioridade: TaskPriority;
  dataPrazo?: string;
}

// --- Helpers de Data (sem alteração) ---
const getToday = () => new Date();
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0];
};

const getWeeksOfMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const weeks: { start: Date; end: Date; label: string }[] = [];
  let currentStart = firstDayOfMonth;
  let weekNumber = 1;
  while (currentStart <= lastDayOfMonth) {
    const currentEnd = new Date(currentStart);
    currentEnd.setDate(currentStart.getDate() + (6 - currentStart.getDay()));
    const actualEnd = currentEnd > lastDayOfMonth ? lastDayOfMonth : currentEnd;
    weeks.push({ start: new Date(currentStart), end: new Date(actualEnd), label: `Semana ${weekNumber}` });
    currentStart = new Date(actualEnd);
    currentStart.setDate(currentStart.getDate() + 1);
    weekNumber++;
  }
  return weeks;
};

// --- Mocks (sem alteração) ---
const today = getToday();
const mockMyTasks: Task[] = [
  { id: 1, titulo: "Ajustar CSS da Home", descricao: "Alinhar widgets.", status: "EM_ANDAMENTO", prioridade: "Alta", dataPrazo: addDays(today, 0) },
  { id: 2, titulo: "Testar fluxo de login", descricao: "Verificar redirecionamento.", status: "PENDENTE", prioridade: "Media", dataPrazo: addDays(today, 2) },
  { id: 3, titulo: "Criar componentes de UI", descricao: "Padronizar botões.", status: "CONCLUIDA", prioridade: "Baixa", dataPrazo: addDays(today, -10) },
  { id: 4, titulo: "Revisar documentação", descricao: "Ler a nova wiki.", status: "PENDENTE", prioridade: "Baixa" },
  { id: 5, titulo: "Planejamento Q1", descricao: "Definir metas.", status: "PENDENTE", prioridade: "Alta", dataPrazo: addDays(today, 45) },
];

const KANBAN_COLUMNS: { id: TaskStatus; title: string; icon: React.ElementType }[] = [
  { id: "PENDENTE", title: "A Fazer", icon: AlertCircle },
  { id: "EM_ANDAMENTO", title: "Em Progresso", icon: Clock },
  { id: "CONCLUIDA", title: "Concluído", icon: CheckCircle },
];

const InternTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockMyTasks);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWeekIdx, setSelectedWeekIdx] = useState(0);

  const weeks = useMemo(() => getWeeksOfMonth(selectedDate), [selectedDate]);

  React.useEffect(() => {
    if (selectedWeekIdx >= weeks.length) setSelectedWeekIdx(0);
  }, [weeks, selectedWeekIdx]);

  // 2. Nova função genérica para atualizar status
  const updateTaskStatus = (taskId: number, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const changeMonth = (delta: number) => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + delta);
      return newDate;
    });
  };

  const filteredTasks = useMemo(() => {
    if (filterMode === 'all') return tasks;
    return tasks.filter(task => {
      if (!task.dataPrazo) return false;
      const taskDateStr = task.dataPrazo + 'T00:00:00'; 
      const taskDate = new Date(taskDateStr);
      if (taskDate.getMonth() !== selectedDate.getMonth() || taskDate.getFullYear() !== selectedDate.getFullYear()) return false;
      if (filterMode === 'month') return true;
      if (filterMode === 'week') {
        const currentWeek = weeks[selectedWeekIdx];
        if (!currentWeek) return false;
        const endOfWeek = new Date(currentWeek.end);
        endOfWeek.setHours(23, 59, 59, 999);
        return taskDate >= currentWeek.start && taskDate <= endOfWeek;
      }
      return true;
    });
  }, [tasks, filterMode, selectedDate, selectedWeekIdx, weeks]);

  const tasksByColumn = (status: TaskStatus) => filteredTasks.filter(t => t.status === status);
  const formatMonth = (date: Date) => date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="intern-tasks-page">
      <header className="intern-tasks-header">
        <div className="header-title"><h1>Minhas Atividades</h1></div>
        <div className="filter-controls">
          <div className="mode-switcher">
            <button className={`filter-chip ${filterMode === 'all' ? 'active' : ''}`} onClick={() => setFilterMode('all')}>Todas</button>
            <button className={`filter-chip ${filterMode === 'month' ? 'active' : ''}`} onClick={() => setFilterMode('month')}>Por Mês</button>
            <button className={`filter-chip ${filterMode === 'week' ? 'active' : ''}`} onClick={() => setFilterMode('week')}>Por Semana</button>
          </div>
          {filterMode !== 'all' && (
            <div className="date-filters animated-fade-in">
              <div className="month-selector">
                <button className="icon-btn-small" onClick={() => changeMonth(-1)}><ChevronLeft size={20} /></button>
                <span className="current-month-label"><Calendar size={16} /> {formatMonth(selectedDate)}</span>
                <button className="icon-btn-small" onClick={() => changeMonth(1)}><ChevronRight size={20} /></button>
              </div>
              {filterMode === 'week' && (
                <div className="week-selector animated-fade-in">
                  {weeks.map((week, idx) => (
                    <button key={idx} className={`week-chip ${idx === selectedWeekIdx ? 'active' : ''}`} onClick={() => setSelectedWeekIdx(idx)}>
                      {week.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="kanban-board">
        {KANBAN_COLUMNS.map(column => {
          const ColumnIcon = column.icon;
          const tasksInCol = tasksByColumn(column.id);
          return (
            <div key={column.id} className={`kanban-column column-${column.id.toLowerCase()}`}>
              <div className="column-header">
                <div className="column-title-group"><ColumnIcon size={18} /><h2>{column.title}</h2></div>
                <span className="task-count">{tasksInCol.length}</span>
              </div>
              <div className="kanban-list">
                {tasksInCol.map(task => (
                  <div key={task.id} className={`kanban-card priority-${task.prioridade.toLowerCase()}`}>
                    <div className="card-badges">
                      <span className={`priority-badge ${task.prioridade.toLowerCase()}`}>{task.prioridade}</span>
                      {task.dataPrazo && <span className="date-badge">{new Date(task.dataPrazo + 'T00:00:00').toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}</span>}
                    </div>
                    <h3 className="card-title">{task.titulo}</h3>
                    <p className="card-desc">{task.descricao}</p>
                    
                    <div className="card-actions">
                      {/* Coluna PENDENTE: Apenas Iniciar */}
                      {task.status === "PENDENTE" && (
                        <button className="action-btn start-btn" onClick={() => updateTaskStatus(task.id, "EM_ANDAMENTO")}>
                          <Play size={14} /> Iniciar
                        </button>
                      )}
                      
                      {/* Coluna EM ANDAMENTO: Voltar ou Concluir */}
                      {task.status === "EM_ANDAMENTO" && (
                        <>
                          <button className="action-btn back-btn" onClick={() => updateTaskStatus(task.id, "PENDENTE")} title="Voltar para 'A Fazer'">
                            <Undo2 size={14} /> Voltar
                          </button>
                          <button className="action-btn finish-btn" onClick={() => updateTaskStatus(task.id, "CONCLUIDA")}>
                            <CheckCircle size={14} /> Concluir
                          </button>
                        </>
                      )}

                      {/* Coluna CONCLUÍDA: Reabrir (Voltar) */}
                      {task.status === "CONCLUIDA" && (
                         <button className="action-btn back-btn" onClick={() => updateTaskStatus(task.id, "EM_ANDAMENTO")} title="Reabrir tarefa">
                           <Undo2 size={14} /> Reabrir
                         </button>
                      )}
                    </div>
                  </div>
                ))}
                 {tasksInCol.length === 0 && <div className="empty-column-state">Sem tarefas</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InternTasks;