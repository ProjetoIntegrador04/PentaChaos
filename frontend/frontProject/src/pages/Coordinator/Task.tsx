import React, { useState, useMemo, useEffect } from "react";
import { Plus, Edit, Search } from "lucide-react";
import "../../styles/Coordinator/Task.css";
import api from "../../api/https";
import { getStoredToken, parseJwt } from "../../auth";
import { Trash } from 'lucide-react';


// --- Tipos ---
type TaskStatus = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA";  
type TaskPriority = "Alta" | "Media" | "Baixa";
type ViewMode = "table" | "cards"; // Novo: modo de visualização

interface Task {
  id: number;
  titulo: string;
  descricao?: string;
  status: TaskStatus | null;
  prioridade: TaskPriority | null;
  responsavelId?: number;
  responsavelNome?: string;
  responsavelEmail?: string;
  dataCriacao: string | null;
  dataConclusao?: string | null;
}

interface User {
  id: number;
  username: string;
  email: string;
}

// --- Modal ---
interface TaskModalProps {
  task: Partial<Task> | null;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  users: User[];
}

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  onClose,
  onSave,
  users,
}) => {
  const [formData, setFormData] = useState({
    titulo: task?.titulo ?? "",
    descricao: task?.descricao ?? "",
    status: task?.status ?? "PENDENTE",
    prioridade: task?.prioridade ?? "Media",
    responsavelId: task?.responsavelId ?? null,
  });

  const [responsavelInput, setResponsavelInput] = useState(
    task?.responsavelNome ?? ""
  );
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredUsers = useMemo(() => {
    const text = responsavelInput.toLowerCase().trim();
    if (!text) return [];
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(text) ||
        u.email.toLowerCase().includes(text)
    );
  }, [responsavelInput, users]);

  const selectUser = (user: User) => {
    setFormData((prev) => ({ ...prev, responsavelId: user.id }));
    setResponsavelInput(user.username);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalTask: Partial<Task> = {
      ...task,
      ...formData,
      responsavelId: formData.responsavelId ?? undefined,
      dataCriacao:
        task?.dataCriacao ??
        new Date().toISOString().substring(0, 10), // yyyy-MM-dd
    };

    onSave(finalTask);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h2>{task?.id ? "Editar Tarefa" : "Nova Tarefa"}</h2>
            <button type="button" className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="modal-body">
            <div className="form-row">
              <label>Título</label>
              <input
                name="titulo"
                required
                value={formData.titulo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    titulo: e.target.value,
                  }))
                }
              />
            </div>

            <div className="form-row">
              <label>Descrição</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    descricao: e.target.value,
                  }))
                }
              />
            </div>

            <div className="form-grid">
              <div className="form-row">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as TaskStatus,
                    }))
                  }
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="EM_ANDAMENTO">Em andamento</option>
                  <option value="CONCLUIDA">Concluída</option>
                </select>
              </div>

              <div className="form-row">
                <label>Prioridade</label>
                <select
                  name="prioridade"
                  value={formData.prioridade}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      prioridade: e.target.value as TaskPriority,
                    }))
                  }
                >
                  <option value="Baixa">Baixa</option>
                  <option value="Media">Média</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>
            </div>

            {/* RESPONSÁVEL */}
            <div className="form-row" style={{ position: "relative" }}>
              <label>Responsável</label>
              <input
                type="text"
                value={responsavelInput}
                placeholder="Digite nome ou e-mail..."
                onChange={(e) => {
                  setResponsavelInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onBlur={() =>
                  setTimeout(() => setShowSuggestions(false), 150)
                }
                onFocus={() => {
                  if (responsavelInput.trim() !== "")
                    setShowSuggestions(true);
                }}
              />

              {showSuggestions && filteredUsers.length > 0 && (
                <ul className="suggestions-list">
                  {filteredUsers.map((u) => (
                    <li
                      key={u.id}
                      className="suggestion-item"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectUser(u)}
                    >
                      <span className="suggestion-name">{u.username}</span>
                      <span className="suggestion-email">{u.email}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="add-btn">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Página Principal ---
const Task: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<Task> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("cards"); // Novo: modo de visualização

  const token = getStoredToken();
  const coordId = token ? Number(parseJwt(token).sub) : null;

  // Carregar tarefas do coordenador + lista de usuários
  useEffect(() => {
    if (!coordId) return;

    // ✅ Endpoint correto - GET /api/v1/tasks (ADMIN vê todas)
    api
      .get("/api/v1/tasks")
      .then((res) => {
        console.log("📡 Tarefas carregadas:", res.data);
        setTasks(
          res.data.map((t: Task) => ({
            ...t,
            status: t.status ?? "PENDENTE",
            prioridade: t.prioridade ?? "Media",
            dataCriacao: t.dataCriacao ?? new Date().toISOString().substring(0, 10),
          }))
        );
      })
      .catch((err) => {
        console.error("❌ Erro ao buscar tarefas:", err);
        alert("Erro ao carregar tarefas. Verifique o console.");
      });

    // ✅ Endpoint correto - GET /api/v1/users
    api
      .get<User[]>("/api/v1/users")
      .then((res) => {
        console.log("📡 Usuários carregados:", res.data);
        setUsers(
          res.data.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
          }))
        );
      })
      .catch((err) => console.error("❌ Erro ao buscar usuários:", err));
  }, [coordId]);

  const handleOpenModal = (task: Partial<Task> | null) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
  };

  // --- SALVAR (POST + PUT) ---
  const handleSaveTask = async (taskToSave: Partial<Task>) => {
    try {
      // Encontrar o nome do responsável se houver ID
      let responsavelNome: string | undefined = taskToSave.responsavelNome;
      if (taskToSave.responsavelId && !responsavelNome) {
        const responsavel = users.find((u) => u.id === taskToSave.responsavelId);
        responsavelNome = responsavel?.username;
      }

      const payload = {
        titulo: taskToSave.titulo,
        descricao: taskToSave.descricao ?? "",
        status: taskToSave.status ?? "PENDENTE",
        prioridade: taskToSave.prioridade ?? "Media",
        dataCriacao:
          taskToSave.dataCriacao ??
          new Date().toISOString().substring(0, 10),
        dataConclusao: taskToSave.dataConclusao ?? null,
        responsavelId: taskToSave.responsavelId ?? null,
      };

      // UPDATE - ✅ Endpoint correto
      if (taskToSave.id) {
        const res = await api.put(`/api/v1/tasks/${taskToSave.id}`, payload);
        console.log("✅ Tarefa atualizada:", res.data);
        
        // Merge com responsavelNome se não veio do backend
        const updatedTask = {
          ...res.data,
          responsavelNome: res.data.responsavelNome || responsavelNome,
        };
        
        setTasks((prev) =>
          prev.map((t) => (t.id === taskToSave.id ? updatedTask : t))
        );
      }
      // CREATE - ✅ Endpoint correto
      else {
        const res = await api.post("/api/v1/tasks", payload);
        console.log("✅ Tarefa criada:", res.data);
        
        // Merge com responsavelNome se não veio do backend
        const newTask = {
          ...res.data,
          responsavelNome: res.data.responsavelNome || responsavelNome,
        };
        
        setTasks((prev) => [newTask, ...prev]);
      }

      alert("Tarefa salva com sucesso!");
      handleCloseModal();
    } catch (err) {
      console.error("❌ Erro ao salvar tarefa:", err);
      alert("Erro ao salvar tarefa. Verifique o console.");
    }
  };

  // --- Excluir tarefa ---
  const handleDeleteTask = (taskId: number) => {
    if (window.confirm("Você tem certeza que deseja excluir esta tarefa?")) {
      // ✅ Endpoint correto
      api.delete(`/api/v1/tasks/${taskId}`)
        .then(() => {
          console.log("✅ Tarefa excluída:", taskId);
          setTasks((prev) => prev.filter((task) => task.id !== taskId));
          alert("Tarefa excluída com sucesso!");
        })
        .catch((err) => {
          console.error("❌ Erro ao excluir tarefa:", err);
          alert("Erro ao excluir tarefa. Verifique o console.");
        });
    }
  };


  // --- FILTRO DE BUSCA ---
  const filteredTasks = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return tasks.filter((task) => {
      const status = (task.status ?? "").toLowerCase();
      const resp = (task.responsavelNome ?? "").toLowerCase();
      const title = (task.titulo ?? "").toLowerCase();

      return (
        title.includes(query) ||
        resp.includes(query) ||
        status.includes(query)
      );
    });
  }, [tasks, searchQuery]);

  // --- Componente: Card de Tarefa ---
  const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const statusSafe = (task.status ?? "PENDENTE").toLowerCase();
    const priSafe = (task.prioridade ?? "Media").toLowerCase();
    
    // Truncar descrição para exibir um resumo
    const descriptionPreview = task.descricao 
      ? task.descricao.length > 80 
        ? task.descricao.substring(0, 80) + "..."
        : task.descricao
      : "Sem descrição";

    return (
      <div className={`task-card task-card-${statusSafe}`}>
        {/* Header do Card */}
        <div className="card-header">
          <div className="card-title">{task.titulo}</div>
          <div className="card-actions">
            <button
              className="icon-btn-small edit"
              onClick={() => handleOpenModal(task)}
              title="Editar"
            >
              <Edit size={14} />
            </button>
            <button
              className="icon-btn-small delete"
              onClick={() => handleDeleteTask(task.id)}
              title="Deletar"
            >
              <Trash size={14} />
            </button>
          </div>
        </div>

        {/* Preview da Descrição */}
        <div className="card-description">
          {descriptionPreview}
        </div>

        {/* Footer do Card */}
        <div className="card-footer">
          <div className="card-badges">
            <span className={`status-badge status-${statusSafe}`}>
              {(task.status ?? "PENDENTE").replace("_", " ")}
            </span>
            <span className={`priority-badge priority-${priSafe}`}>
              {task.prioridade ?? "Media"}
            </span>
          </div>
        </div>

        {/* Responsável e Data */}
        <div className="card-meta">
          <div className="meta-item">
            <span className="label">Responsável:</span>
            <span className="value">{task.responsavelNome ?? "Não atribuído"}</span>
          </div>
          <div className="meta-item">
            <span className="label">Criação:</span>
            <span className="value">{task.dataCriacao ?? "—"}</span>
          </div>
        </div>
      </div>
    );
  };

  // --- Componente: Coluna Kanban ---
  const KanbanColumn: React.FC<{ status: TaskStatus; tasks: Task[] }> = ({ status, tasks }) => {
    const statusLabel = status.replace("_", " ");

    return (
      <div className="kanban-column">
        <div className="column-header">
          <h3>{statusLabel}</h3>
          <span className="card-count">{tasks.length}</span>
        </div>
        <div className="column-tasks">
          {tasks.length === 0 ? (
            <div className="empty-column">Nenhuma tarefa</div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </div>
      </div>
    );
  };

  // --- Agrupar tarefas por status para visualização Kanban ---
  const groupedTasks = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      PENDENTE: [],
      EM_ANDAMENTO: [],
      CONCLUIDA: [],
    };

    filteredTasks.forEach((task) => {
      const status = (task.status ?? "PENDENTE") as TaskStatus;
      groups[status].push(task);
    });

    return groups;
  }, [filteredTasks]);

  return (
    <div className="tasks-page">
      <header className="tasks-header">
        <h1>Gerenciador de Tarefas</h1>
        <div className="header-controls">
          <button className="add-btn" onClick={() => handleOpenModal(null)}>
            <Plus size={16} /> Criar Tarefa
          </button>
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === "cards" ? "active" : ""}`}
              onClick={() => setViewMode("cards")}
              title="Visualização em Cards"
            >
              ▢ Cards
            </button>
            <button
              className={`view-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Visualização em Tabela"
            >
              ≡ Tabela
            </button>
          </div>
        </div>
      </header>

      {/* Barra de pesquisa */}
      <div className="search-box">
        <span className="search-icon">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Pesquisar por título, responsável ou status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* VISUALIZAÇÃO EM CARDS (KANBAN) */}
      {viewMode === "cards" && (
        <div className="kanban-board">
          <KanbanColumn status="PENDENTE" tasks={groupedTasks.PENDENTE} />
          <KanbanColumn status="EM_ANDAMENTO" tasks={groupedTasks.EM_ANDAMENTO} />
          <KanbanColumn status="CONCLUIDA" tasks={groupedTasks.CONCLUIDA} />
        </div>
      )}

      {/* VISUALIZAÇÃO EM TABELA */}
      {viewMode === "table" && (
        <div className="tasks-table">
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Título</th>
                <th>Descrição</th>
                <th>Responsável</th>
                <th>Prioridade</th>
                <th>Criação</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {filteredTasks.map((task) => {
                const statusSafe = (task.status ?? "PENDENTE").toLowerCase();
                const priSafe = (task.prioridade ?? "Media").toLowerCase();

                return (
                  <tr key={task.id}>
                    <td>
                      <span className={`status-badge status-${statusSafe}`}>
                        {(task.status ?? "PENDENTE").replace("_", " ")}
                      </span>
                    </td>

                    <td className="task-title">{task.titulo}</td>

                    <td className="task-description">
                      {task.descricao ? (
                        task.descricao.length > 50
                          ? task.descricao.substring(0, 50) + "..."
                          : task.descricao
                      ) : (
                        "—"
                      )}
                    </td>

                    <td>{task.responsavelNome ?? "—"}</td>

                    <td>
                      <span className={`priority-badge priority-${priSafe}`}>
                        {task.prioridade ?? "Media"}
                      </span>
                    </td>

                    <td>{task.dataCriacao ?? "—"}</td>

                    <td className="acoes">
                      <button
                        className="icon-btn edit"
                        onClick={() => handleOpenModal(task)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash size={16} />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTasks.length === 0 && (
            <div className="empty-state">
              Nenhuma tarefa encontrada.
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <TaskModal
          task={currentTask}
          users={users}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default Task;
