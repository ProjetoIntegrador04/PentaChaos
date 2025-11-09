import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// 1. Adicionado ClipboardList aos imports
import { Clock, CalendarCheck, Settings, ClipboardList } from "lucide-react";
import "../../styles/Intern/Home.css"; 

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [horaAtual, setHoraAtual] = useState<string>(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  useEffect(() => {
    const timerId = setInterval(() => {
      setHoraAtual(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="app-home-page">
      <header className="app-home-header">
        <h1>Olá, Pablo!</h1>
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