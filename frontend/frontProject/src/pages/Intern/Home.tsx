import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, CalendarCheck, Settings, ClipboardList } from "lucide-react";
import api from "../../api/https";
import "../../styles/Intern/Home.css"; 

interface Usuario {
  id: number;
  username: string;
  fullName?: string;
  email: string;
}

interface Task {
  id: number;
  titulo: string;
  status: string;
  prioridade: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [horaAtual, setHoraAtual] = useState<string>(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [proximasTarefas, setProximasTarefas] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timerId = setInterval(() => {
      setHoraAtual(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  // Carregar dados do usuário e tarefas
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // ✅ Buscar dados do usuário logado
      const resUser = await api.get<Usuario>("/api/v1/users/me");
      console.log("📡 Dados do usuário carregados:", resUser.data);
      setUsuario(resUser.data);

      // ✅ Buscar próximas 3 tarefas pendentes
      const resTasks = await api.get<Task[]>("/api/v1/tasks");
      const tarefasPendentes = resTasks.data
        .filter(t => t.status === "PENDENTE" || t.status === "EM_ANDAMENTO")
        .slice(0, 3);
      console.log("📡 Próximas tarefas carregadas:", tarefasPendentes);
      setProximasTarefas(tarefasPendentes);
    } catch (error) {
      console.error("❌ Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const nomeExibicao = loading 
    ? "Carregando..." 
    : usuario?.fullName || usuario?.username || "Usuário";

  return (
    <div className="app-home-page">
      <header className="app-home-header">
        <h1>Olá, {nomeExibicao}!</h1>
        <p>Seja bem-vindo(a) ao seu painel.</p>
      </header>

      {/* Widget Principal de Ponto */}
      <div className="ponto-widget-container">
        <div className="panel ponto-widget">
          <h2>Seu Ponto</h2>
          <div className="live-clock">{horaAtual}</div>
          <p>Pronto para começar o dia?</p>
          {/* Ajustei o caminho para absoluto '/intern/ponto' para evitar erros */}
          <button className="btn-ponto" onClick={() => navigate("/intern/ponto")}>
            <Clock size={20} />
            Registrar Ponto Agora
          </button>
        </div>
      </div>

      {/* Próximas Tarefas */}
      {!loading && proximasTarefas.length > 0 && (
        <div className="panel">
          <h2>📋 Próximas Tarefas</h2>
          <div style={{ marginTop: "1rem" }}>
            {proximasTarefas.map((task) => (
              <div 
                key={task.id} 
                style={{ 
                  padding: "0.75rem", 
                  marginBottom: "0.5rem", 
                  background: "#f5f5f5",
                  borderRadius: "8px",
                  borderLeft: `4px solid ${
                    task.prioridade === "Alta" ? "#ef4444" : 
                    task.prioridade === "Media" ? "#f59e0b" : "#10b981"
                  }`
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{task.titulo}</strong>
                  <span style={{ 
                    fontSize: "0.75rem", 
                    padding: "0.25rem 0.5rem",
                    background: task.status === "PENDENTE" ? "#fef3c7" : "#dbeafe",
                    borderRadius: "4px"
                  }}>
                    {task.status === "PENDENTE" ? "A Fazer" : "Em Progresso"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid de Atalhos Rápidos */}
      <div className="quick-links-grid">
        {/* CARD NOVO: Minhas Atividades */}
        <div className="panel quick-link-card" onClick={() => navigate("/intern/task")}>
          <ClipboardList size={32} />
          <h3>Minhas Atividades</h3>
          <p>Visualize e atualize o status das suas tarefas.</p>
        </div>

        {/* Card Frequência (caminho corrigido) */}
        <div className="panel quick-link-card" onClick={() => navigate("/intern/frequencia")}>
          <CalendarCheck size={32} />
          <h3>Minha Frequência</h3>
          <p>Consulte seu histórico de pontos e espelho.</p>
        </div>

        {/* Card Configurações (caminho corrigido) */}
        <div className="panel quick-link-card" onClick={() => navigate("/intern/settings")}>
          <Settings size={32} />
          <h3>Configurações</h3>
          <p>Ajuste seu perfil e preferências.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;