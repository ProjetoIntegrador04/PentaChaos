import React, { useState, useMemo, useEffect } from "react";
import { Plus, Edit, Search } from "lucide-react";
import "../../styles/Coordinator/Task.css";
import api from "../../api/https";
import { getStoredToken, parseJwt } from "../../auth";

// --- Tipos ---
type TaskStatus = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA";
type TaskPriority = "Alta" | "Media" | "Baixa";

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
  onSave: (task: any) => void;
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

    const finalTask = {
      ...task,
      ...formData,
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

  const token = getStoredToken();
  const coordId = token ? Number(parseJwt(token).sub) : null;

  // Carregar tarefas do coordenador + lista de usuários
  useEffect(() => {
    if (!coordId) return;

    api
      .get(`/tasks/coordinator/${coordId}`)
      .then((res) =>
        setTasks(
          res.data.map((t: Task) => ({
            ...t,
            status: t.status ?? "PENDENTE",
            prioridade: t.prioridade ?? "Media",
            dataCriacao: t.dataCriacao ?? new Date().toISOString().substring(0, 10),
          }))
        )
      )
      .catch((err) => console.error("Erro ao buscar tarefas:", err));

    api.get("/users").then((res) =>
      setUsers(
        res.data.map((u: any) => ({
          id: u.id,
          username: u.username,
          email: u.email,
        }))
      )
    );
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
  const handleSaveTask = async (taskToSave: any) => {
    try {
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
        criadoPorId: coordId,
      };

      // UPDATE
      if (taskToSave.id) {
        const res = await api.put(`/tasks/${taskToSave.id}`, payload);
        setTasks((prev) =>
          prev.map((t) => (t.id === taskToSave.id ? res.data : t))
        );
      }
      // CREATE
      else {
        const res = await api.post("/tasks", payload);
        setTasks((prev) => [res.data, ...prev]);
      }

      alert("Tarefa salva com sucesso!");
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar tarefa.");
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
  return (
    <div className="tasks-page">
      <header className="tasks-header">
        <h1>Gerenciador de Tarefas</h1>
        <button className="add-btn" onClick={() => handleOpenModal(null)}>
          <Plus size={16} /> Criar Tarefa
        </button>
      </header>

      {/* Barra de pesquisa */}
      <div className="search-box">
        <span className="search-icon">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Pesquisar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* TABELA */}
      <div className="tasks-table">
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Título</th>
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
