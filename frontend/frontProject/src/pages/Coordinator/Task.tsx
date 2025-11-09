import React, { useState, useMemo } from 'react';
// 1. Ícones atualizados para a nova interface
import { Plus, Edit, Search } from 'lucide-react'; 
import '../../styles/Coordinator/Task.css'; 
// import api from '../../api/https'; 

// --- Tipos e Mocks (Sem alteração) ---
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

const mockTasks: Task[] = [
  { id: 1, titulo: "Criar módulo backend", descricao: "Implementar CRUD de tarefas", status: "PENDENTE", prioridade: "Alta", responsavel: "Juan", dataCriacao: "2025-10-27" },
  { id: 2, titulo: "Atualizar módulo backend", descricao: "Ajustar endpoints REST", status: "EM_ANDAMENTO", prioridade: "Alta", responsavel: "Juan", dataCriacao: "2025-10-26" },
  { id: 3, titulo: "Testar deploy", descricao: "Verificar deploy em dev", status: "EM_ANDAMENTO", prioridade: "Media", responsavel: "Pablo", dataCriacao: "2025-10-25" },
  { id: 4, titulo: "Documentar API", descricao: "Usar Swagger", status: "PENDENTE", prioridade: "Baixa", responsavel: "Ana", dataCriacao: "2025-10-27" },
  { id: 5, titulo: "Revisar Frontend", descricao: "Corrigir bugs de layout", status: "CONCLUIDA", prioridade: "Media", responsavel: "Maria", dataCriacao: "2025-10-20", dataConclusao: "2025-10-25" },
];

// --- Sub-componente: Modal (Sem alteração, está perfeito) ---
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
            {/* ... (Todo o formulário do modal permanece igual) ... */}
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


// --- Componente Principal da Página ---
const Task: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<Task> | null>(null);
  
  // 2. Estado para a busca
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenModal = (task: Partial<Task> | null) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
  };

  const handleSaveTask = async (taskToSave: Task) => {
    // ... (Lógica de salvar permanece a mesma) ...
    if (taskToSave.id) {
      setTasks(prev => prev.map(t => t.id === taskToSave.id ? taskToSave : t));
      alert("Tarefa atualizada!");
    } else {
      const newTask = { ...taskToSave, id: Date.now() }; 
      setTasks(prev => [newTask, ...prev]);
      alert("Tarefa criada!");
    }
    handleCloseModal();
  };

  // 3. Memo para filtrar as tarefas
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

      {/* 4. Barra de Busca Adicionada */}
      <div className="search-box">
        <span className="search-icon"><Search size={18} /></span>
        <input
          type="text"
          placeholder="Pesquisar por título, responsável ou status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 5. Layout de Tabela (inspirado no Users.tsx) */}
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