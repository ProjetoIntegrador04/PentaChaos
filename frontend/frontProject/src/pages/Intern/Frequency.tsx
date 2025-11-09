import React, { useState, useMemo } from "react";
// 1. Importar o ícone de Edição
import { ChevronLeft, ChevronRight, LogIn, LogOut, Coffee, Edit } from "lucide-react";
import "../../styles/Intern/Frequency.css"; 

// --- Tipos e Mocks (sem alteração) ---
interface PontoRecord {
  id: number | string;
  timestamp: string; 
  tipo: "ENTRY" | "EXIT" | "BREAK_START" | "BREAK_END";
}
type PontoTipo = PontoRecord['tipo'];

const mockPontos: PontoRecord[] = [
  { id: 1, timestamp: "2025-11-03T09:01:15Z", tipo: "ENTRY" },
  { id: 2, timestamp: "2025-11-03T12:30:10Z", tipo: "BREAK_START" },
  { id: 3, timestamp: "2025-11-03T13:31:05Z", tipo: "BREAK_END" },
  { id: 4, timestamp: "2025-11-03T16:05:20Z", tipo: "EXIT" },
  { id: 5, timestamp: "2025-11-01T09:03:00Z", tipo: "ENTRY" },
  { id: 6, timestamp: "2025-11-01T16:01:00Z", tipo: "EXIT" },
  { id: 7, timestamp: "2025-10-31T09:00:00Z", tipo: "ENTRY" },
  { id: 8, timestamp: "2025-10-31T16:00:00Z", tipo: "EXIT" },
];

const pontoTipoMap = {
  ENTRY: { label: "Entrada", icon: LogIn },
  BREAK_START: { label: "Início Pausa", icon: Coffee },
  BREAK_END: { label: "Fim Pausa", icon: Coffee },
  EXIT: { label: "Saída", icon: LogOut },
};

// 2. Ordem fixa que queremos exibir os slots
const PONTOS_DO_DIA: PontoTipo[] = ["ENTRY", "BREAK_START", "BREAK_END", "EXIT"];

// --- Componente ---
const Frequency: React.FC = () => {
  const [pontos] = useState<PontoRecord[]>(mockPontos);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  };

  // 3. Helper para formatar apenas a hora
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
        {groupedPontos.size === 0 && (
          <div className="state-message">
            <span>Nenhum registro encontrado para este mês.</span>
          </div>
        )}

        {groupedPontos.size > 0 && (
          [...groupedPontos.entries()].map(([date, records]) => {
            const weekDay = new Date(records[0].timestamp).toLocaleDateString("pt-BR", { weekday: 'long' });
            // 5. Reverte os registros para ordem cronológica (do dia)
            const recordsInOrder = [...records].reverse();

            return (
              <div key={date} className="panel day-card">
                <div className="day-header">
                  {/* 6. Agrupa o título e adiciona o botão de ajuste */}
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
                  {/* 7. Mapeia a ORDEM FIXA de pontos, não os registros */}
                  {PONTOS_DO_DIA.map((tipo) => {
                    // 8. Encontra o primeiro registro daquele tipo
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