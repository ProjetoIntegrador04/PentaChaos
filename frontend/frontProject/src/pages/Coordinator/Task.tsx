import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Edit, Search } from 'lucide-react';
import '../../styles/Coordinator/Task.css';
import api from '../../api/https';

// --- Tipos ---
type TaskStatus = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA";
type TaskPriority = "Alta" | "Media" | "Baixa";

interface Task {
  id: number;
  titulo: string;
  descricao?: string;
  status: TaskStatus;
  prioridade: TaskPriority;
  responsavel: string;
  dataCriacao: string;
  dataConclusao?: string | null;
}

// --- Sub-componente: Modal ---
interface TaskModalProps {
  task: Partial<Task> | null;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    titulo: task?.titulo ?? "",
    descricao: task?.descricao ?? "",
    status: task?.status ?? "PENDENTE",
    prioridade: task?.prioridade ?? "Media",
    responsavel: task?.responsavel ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataCriacao = task?.dataCriacao ?? new Date().toISOString().split('T')[0];
    onSave({ ...task, ...formData, dataCriacao } as Task);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h2>{task?.id ? "Editar Tarefa" : "Nova Tarefa"}</h2>
            <button type="button" className="close-btn" onClick={onClose}>&times;</button>
          </div>
          <div className="modal-body">
            <div className="form-row">
              <label>Título</label>
              <input name="titulo" value={formData.titulo} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <label>Descrição</label>
              <textarea name="descricao" value={formData.descricao} onChange={handleChange} />
            </div>
            <div className="form-grid">
              <div className="form-row">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="PENDENTE">Pendente</option>
                  <option value="EM_ANDAMENTO">Em Andamento</option>
                  <option value="CONCLUIDA">Concluída</option>
                </select>
              </div>
              <div className="form-row">
                <label>Prioridade</label>
                <select name="prioridade" value={formData.prioridade} onChange={handleChange}>
                  <option value="Baixa">Baixa</option>
                  <option value="Media">Média</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <label>Responsável</label>
              <input name="responsavel" value={formData.responsavel} onChange={handleChange} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="add-btn">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Página Principal ---
const Task: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<Task> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Buscar tarefas ao montar
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        alert("Falha ao carregar tarefas. Verifique sua conexão ou login.");
      }
    };
    fetchTasks();
  }, []);

  // 🔹 Abrir/fechar modal
  const handleOpenModal = (task: Partial<Task> | null) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
  };

  // 🔹 Criar ou atualizar tarefa
  const handleSaveTask = async (taskToSave: Task) => {
    try {
      if (taskToSave.id) {
        const response = await api.put(`/tasks/${taskToSave.id}`, taskToSave);
        setTasks(prev => prev.map(t => t.id === taskToSave.id ? response.data : t));
        alert("Tarefa atualizada com sucesso!");
      } else {
        const response = await api.post('/tasks', taskToSave);
        setTasks(prev => [response.data, ...prev]);
        alert("Tarefa criada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      alert("Erro ao salvar tarefa.");
    }
    handleCloseModal();
  };

  // 🔹 Filtro de pesquisa
  const filteredTasks = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return tasks.filter(task =>
      task.titulo.toLowerCase().includes(query) ||
      task.responsavel.toLowerCase().includes(query) ||
      task.status.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);

  return (
    <div className="tasks-page">
      <header className="tasks-header">
        <h1>Gerenciador de Tarefas</h1>
        <button className="add-btn" onClick={() => handleOpenModal(null)}>
          <Plus size={16} /> Criar Tarefa
        </button>
      </header>

      <div className="search-box">
        <span className="search-icon"><Search size={18} /></span>
        <input
          type="text"
          placeholder="Pesquisar por título, responsável ou status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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
            {filteredTasks.map((task) => (
              <tr key={task.id}>
                <td>
                  <span className={`status-badge status-${task.status.toLowerCase()}`}>
                    {task.status.replace("_", " ")}
                  </span>
                </td>
                <td className="task-title">{task.titulo}</td>
                <td>{task.responsavel}</td>
                <td>
                  <span className={`priority-badge priority-${task.prioridade.toLowerCase()}`}>
                    {task.prioridade}
                  </span>
                </td>
                <td>{task.dataCriacao}</td>
                <td className="acoes">
                  <button className="icon-btn edit" onClick={() => handleOpenModal(task)}>
                    <Edit size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <TaskModal
          task={currentTask}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default Task;
