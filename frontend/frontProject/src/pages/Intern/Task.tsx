import React, { useEffect, useMemo, useState } from "react";
import {
  Play,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Undo2,
} from "lucide-react";

import "../../styles/Intern/Task.css";
import api from "../../api/https";
import { getStoredToken, parseJwt } from "../../auth";

type TaskStatus = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA";
type TaskPriority = "Alta" | "Media" | "Baixa";
type FilterMode = "all" | "month" | "week";

interface Task {
  id: number;
  titulo: string;
  descricao: string;
  status: TaskStatus | null;
  prioridade: TaskPriority | null;
  dataCriacao?: string | null;
  dataConclusao?: string | null;
  responsavelId: number;
}

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

    weeks.push({
      start: new Date(currentStart),
      end: new Date(actualEnd),
      label: `Semana ${weekNumber}`,
    });

    currentStart = new Date(actualEnd);
    currentStart.setDate(currentStart.getDate() + 1);
    weekNumber++;
  }

  return weeks;
};

const formatMonth = (date: Date) =>
  date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

const InternTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWeekIdx, setSelectedWeekIdx] = useState(0);

  const weeks = useMemo(() => getWeeksOfMonth(selectedDate), [selectedDate]);

  const token = getStoredToken();
  const userId = token ? Number(parseJwt(token).sub) : null;

  useEffect(() => {
    if (!userId) return;

    const fetchTasks = async () => {
      try {
        const res = await api.get<Task[]>(`/tasks/user/${userId}`);
        setTasks(
          res.data.map((t) => ({
            ...t,
            prioridade: t.prioridade ?? "Media",
            status: t.status ?? "PENDENTE",
          }))
        );
      } catch (err) {
        console.error("Erro ao carregar tarefas:", err);
      }
    };

    fetchTasks();
  }, [userId]);

  useEffect(() => {
    if (selectedWeekIdx >= weeks.length) setSelectedWeekIdx(0);
  }, [weeks, selectedWeekIdx]);

  const updateTaskStatus = async (taskId: number, newStatus: TaskStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, {
        status: newStatus,
      });

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Não foi possível atualizar o status.");
    }
  };

  const changeMonth = (delta: number) => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + delta);
      return newDate;
    });
  };

  const filteredTasks = useMemo(() => {
    if (filterMode === "all") return tasks;

    return tasks.filter((task) => {
      if (!task.dataCriacao) return false;

      const taskDate = new Date(task.dataCriacao + "T00:00:00");

      if (
        taskDate.getMonth() !== selectedDate.getMonth() ||
        taskDate.getFullYear() !== selectedDate.getFullYear()
      ) {
        return false;
      }

      if (filterMode === "month") return true;

      if (filterMode === "week") {
        const week = weeks[selectedWeekIdx];
        if (!week) return false;

        const endOfWeek = new Date(week.end);
        endOfWeek.setHours(23, 59, 59, 999);

        return taskDate >= week.start && taskDate <= endOfWeek;
      }

      return true;
    });
  }, [tasks, filterMode, selectedDate, selectedWeekIdx, weeks]);

  const tasksByColumn = (status: TaskStatus) =>
    filteredTasks.filter((t) => (t.status ?? "PENDENTE") === status);

  return (
    <div className="intern-tasks-page">
      <header className="intern-tasks-header">
        <div className="header-title">
          <h1>Minhas Atividades</h1>
        </div>

        <div className="filter-controls">
          <div className="mode-switcher">
            <button
              className={`filter-chip ${filterMode === "all" ? "active" : ""}`}
              onClick={() => setFilterMode("all")}
            >
              Todas
            </button>
            <button
              className={`filter-chip ${
                filterMode === "month" ? "active" : ""
              }`}
              onClick={() => setFilterMode("month")}
            >
              Por Mês
            </button>
            <button
              className={`filter-chip ${
                filterMode === "week" ? "active" : ""
              }`}
              onClick={() => setFilterMode("week")}
            >
              Por Semana
            </button>
          </div>

          {filterMode !== "all" && (
            <div className="date-filters animated-fade-in">
              <div className="month-selector">
                <button
                  type="button"
                  className="icon-btn-small"
                  onClick={() => changeMonth(-1)}
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="current-month-label">
                  <Calendar size={16} /> {formatMonth(selectedDate)}
                </span>
                <button
                  type="button"
                  className="icon-btn-small"
                  onClick={() => changeMonth(1)}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {filterMode === "week" && (
                <div className="week-selector animated-fade-in">
                  {weeks.map((w, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`week-chip ${
                        idx === selectedWeekIdx ? "active" : ""
                      }`}
                      onClick={() => setSelectedWeekIdx(idx)}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="kanban-board">
        {(
          [
            { id: "PENDENTE", title: "A Fazer", icon: AlertCircle },
            { id: "EM_ANDAMENTO", title: "Em Progresso", icon: Clock },
            { id: "CONCLUIDA", title: "Concluído", icon: CheckCircle },
          ] as const
        ).map((column) => {
          const ColumnIcon = column.icon;
          const columnTasks = tasksByColumn(column.id);

          return (
            <div
              key={column.id}
              className={`kanban-column column-${column.id.toLowerCase()}`}
            >
              <div className="column-header">
                <div className="column-title-group">
                  <ColumnIcon size={18} />
                  <h2>{column.title}</h2>
                </div>
                <span className="task-count">{columnTasks.length}</span>
              </div>

              <div className="kanban-list">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`kanban-card priority-${(
                      task.prioridade ?? "Media"
                    ).toLowerCase()}`}
                  >
                    <div className="card-badges">
                      <span
                        className={`priority-badge ${(task.prioridade ??
                          "Media"
                        ).toLowerCase()}`}
                      >
                        {task.prioridade ?? "Media"}
                      </span>

                      {task.dataCriacao && (
                        <span className="date-badge">
                          {new Date(
                            task.dataCriacao + "T00:00:00"
                          ).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </span>
                      )}
                    </div>

                    <h3 className="card-title">{task.titulo}</h3>
                    <p className="card-desc">{task.descricao}</p>

                    <div className="card-actions">
                      {task.status === "PENDENTE" && (
                        <button
                          type="button"
                          className="action-btn start-btn"
                          onClick={() =>
                            updateTaskStatus(task.id, "EM_ANDAMENTO")
                          }
                        >
                          <Play size={14} /> Iniciar
                        </button>
                      )}

                      {task.status === "EM_ANDAMENTO" && (
                        <>
                          <button
                            type="button"
                            className="action-btn back-btn"
                            onClick={() =>
                              updateTaskStatus(task.id, "PENDENTE")
                            }
                            title="Voltar"
                          >
                            <Undo2 size={14} /> Voltar
                          </button>
                          <button
                            type="button"
                            className="action-btn finish-btn"
                            onClick={() =>
                              updateTaskStatus(task.id, "CONCLUIDA")
                            }
                          >
                            <CheckCircle size={14} /> Concluir
                          </button>
                        </>
                      )}

                      {task.status === "CONCLUIDA" && (
                        <button
                          type="button"
                          className="action-btn back-btn"
                          onClick={() =>
                            updateTaskStatus(task.id, "EM_ANDAMENTO")
                          }
                          title="Reabrir"
                        >
                          <Undo2 size={14} /> Reabrir
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {columnTasks.length === 0 && (
                  <div className="empty-column-state">Sem tarefas</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InternTasks;
