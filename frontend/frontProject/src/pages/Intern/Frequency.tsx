import React, { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, LogIn, LogOut, Coffee, Edit } from "lucide-react";
import api from "../../api/https";
import "../../styles/Intern/Frequency.css"; 

// --- Tipos ---
interface PontoRecord {
  id: number;
  timestamp: string; 
  tipo: "ENTRY" | "EXIT" | "LUNCH_START" | "LUNCH_END";
}
type PontoTipo = PontoRecord['tipo'];

// Mapeamento de tipos (note que o backend usa LUNCH_ ao invés de BREAK_)
const pontoTipoMap = {
  ENTRY: { label: "Entrada", icon: LogIn },
  LUNCH_START: { label: "Início Pausa", icon: Coffee },
  LUNCH_END: { label: "Fim Pausa", icon: Coffee },
  EXIT: { label: "Saída", icon: LogOut },
};

// Ordem fixa de exibição dos slots
const PONTOS_DO_DIA: PontoTipo[] = ["ENTRY", "LUNCH_START", "LUNCH_END", "EXIT"];

// --- Componente ---
const Frequency: React.FC = () => {
  const [pontos, setPontos] = useState<PontoRecord[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Carregar histórico de pontos ao montar o componente
  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    setLoading(true);
    try {
      // ✅ Endpoint correto - GET /api/v1/clockentries/me/history
      const res = await api.get<PontoRecord[]>("/api/v1/clockentries/me/history");
      console.log("📡 Histórico de pontos carregado:", res.data);
      setPontos(res.data);
    } catch (error) {
      console.error("❌ Erro ao carregar histórico:", error);
      alert("Erro ao carregar histórico de pontos. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("pt-BR", {
      hour: '2-digit', minute: '2-digit'
    });
  };

  const groupedPontos = useMemo(() => {
    // ... (lógica de agrupar por mês e dia permanece a mesma) ...
    const ano = currentMonth.getFullYear();
    const mes = currentMonth.getMonth() + 1; 
    const pontosDoMes = pontos.filter(p => {
        const d = new Date(p.timestamp);
        return d.getFullYear() === ano && (d.getMonth() + 1) === mes;
    });
    const groups = new Map<string, PontoRecord[]>();
    const sortedPontos = [...pontosDoMes].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    for (const ponto of sortedPontos) {
      const dateKey = new Date(ponto.timestamp).toLocaleDateString("pt-BR");
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(ponto);
    }
    return groups;
  }, [pontos, currentMonth]);

  const changeMonth = (amount: number) => {
    setCurrentMonth((prevDate) => {
      const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + amount, 1);
      return newDate;
    });
  };

  // 4. Ação para o botão de ajuste
  const handleAdjustRequest = (date: string) => {
    // No futuro, isso pode abrir um modal ou navegar
    alert(`Uma solicitação de ajuste para o dia ${date} será enviada.`);
  };

  return (
    <div className="frequency-page">
      <header className="frequency-header">
        <h1>Minha Frequência</h1>
      </header>

      {/* Seletor de Mês */}
      <div className="month-selector-panel panel">
        {/* ... (código do seletor sem alteração) ... */}
        <button className="month-arrow-btn" onClick={() => changeMonth(-1)} aria-label="Mês anterior">
          <ChevronLeft size={20} />
        </button>
        <span className="current-month">{formatMonthYear(currentMonth)}</span>
        <button className="month-arrow-btn" onClick={() => changeMonth(1)} aria-label="Próximo mês">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Container dos Registros */}
      <div className="records-container">
        {loading ? (
          <div className="state-message">
            <span>⏳ Carregando histórico...</span>
          </div>
        ) : groupedPontos.size === 0 ? (
          <div className="state-message">
            <span>Nenhum registro encontrado para este mês.</span>
          </div>
        ) : null}

        {!loading && groupedPontos.size > 0 && (
          [...groupedPontos.entries()].map(([date, records]) => {
            const weekDay = new Date(records[0].timestamp).toLocaleDateString("pt-BR", { weekday: 'long' });
            const recordsInOrder = [...records].reverse();

            return (
              <div key={date} className="panel day-card">
                <div className="day-header">
                  <div className="day-title-group">
                    <span className="day-date">{date}</span>
                    <span className="day-weekday">{weekDay}</span>
                  </div>
                  <button className="adjust-btn" onClick={() => handleAdjustRequest(date)}>
                    <Edit size={14} />
                    Solicitar Ajuste
                  </button>
                </div>
                <ul className="point-list">
                  {PONTOS_DO_DIA.map((tipo) => {
                    const record = recordsInOrder.find(p => p.tipo === tipo);
                    const { label, icon: PontoIcon } = pontoTipoMap[tipo];
                    
                    return (
                      <li key={tipo} className="point-item">
                        <div className="point-type">
                          <PontoIcon size={16} />
                          <span>{label}</span>
                        </div>
                        <span className={`point-time ${!record ? 'empty' : ''}`}>
                          {record ? formatTime(record.timestamp) : "--:--"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Frequency;