import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, CalendarCheck, Settings } from "lucide-react";
import "../../styles/Intern/Home.css"; 

// O nome do componente agora é "Home"
const Home: React.FC = () => {
  const navigate = useNavigate();
  const [horaAtual, setHoraAtual] = useState<string>(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  // Efeito para o relógio em tempo real
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
      {/* 1. Cabeçalho de Boas-Vindas */}
      <header className="app-home-header">
        <h1>Olá, Pablo!</h1>
        <p>Seja bem-vindo(a) ao seu painel.</p>
      </header>

      {/* 2. Widget Principal de Ponto */}
      <div className="ponto-widget-container">
        <div className="panel ponto-widget">
          <h2>Seu Ponto</h2>
          <div className="live-clock">{horaAtual}</div>
          <p>Pronto para começar o dia?</p>
          <button className="btn-ponto" onClick={() => navigate("../intern/ponto")}>
            <Clock size={20} />
            Registrar Ponto Agora
          </button>
        </div>
      </div>

      {/* 3. Atalhos Rápidos */}
      <div className="quick-links-grid">
        <div className="panel quick-link-card" onClick={() => navigate("..intern/ponto")}>
          <CalendarCheck size={32} />
          <h3>Minha Frequência</h3>
          <p>Consulte seu histórico de pontos e espelho.</p>
        </div>

        <div className="panel quick-link-card" onClick={() => navigate("/app/settings")}>
          <Settings size={32} />
          <h3>Configurações</h3>
          <p>Ajuste seu perfil e preferências.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;