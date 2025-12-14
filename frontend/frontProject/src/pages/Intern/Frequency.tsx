import React, { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, LogIn, LogOut, Coffee, Edit, X, Save } from "lucide-react";
import api from "../../api/https";
import "../../styles/Intern/Frequency.css"; 

// --- Tipos ---
interface PontoRecord {
  id: number;
  timestamp: string; 
  tipo: "ENTRY" | "EXIT" | "LUNCH_START" | "LUNCH_END";
}
type PontoTipo = PontoRecord['tipo'];

interface EditingRecord {
  date: string;
  records: PontoRecord[];
}

// Mapeamento de tipos
const pontoTipoMap: Record<PontoTipo, { label: string; icon: React.ComponentType<{ size?: number }> }> = {
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
  const [editingDay, setEditingDay] = useState<EditingRecord | null>(null);
  const [editedTimes, setEditedTimes] = useState<Record<PontoTipo, string>>({
    ENTRY: "",
    LUNCH_START: "",
    LUNCH_END: "",
    EXIT: "",
  });

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

  // Pegar últimos 2 dias com registros
  const ultimosDoisDias = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const grupos = new Map<string, PontoRecord[]>();
    const sortedPontos = [...pontos].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    for (const ponto of sortedPontos) {
      const pontoDate = new Date(ponto.timestamp);
      pontoDate.setHours(0, 0, 0, 0);
      
      // Apenas últimos 2 dias
      const diffDays = Math.floor((hoje.getTime() - pontoDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays <= 1) {
        const dateKey = pontoDate.toLocaleDateString("pt-BR");
        if (!grupos.has(dateKey)) {
          grupos.set(dateKey, []);
        }
        grupos.get(dateKey)!.push(ponto);
      }
    }
    return grupos;
  }, [pontos]);

  const changeMonth = (amount: number) => {
    setCurrentMonth((prevDate) => {
      const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + amount, 1);
      return newDate;
    });
  };

  // Abrir modal de edição
  const handleAdjustRequest = (date: string, records: PontoRecord[]) => {
    setEditingDay({ date, records });
    
    // Preencher horários existentes
    const times: Record<PontoTipo, string> = {
      ENTRY: "",
      LUNCH_START: "",
      LUNCH_END: "",
      EXIT: "",
    };
    
    records.forEach(record => {
      const time = new Date(record.timestamp).toLocaleTimeString("pt-BR", {
        hour: '2-digit',
        minute: '2-digit'
      });
      times[record.tipo] = time;
    });
    
    setEditedTimes(times);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setEditingDay(null);
    setEditedTimes({
      ENTRY: "",
      LUNCH_START: "",
      LUNCH_END: "",
      EXIT: "",
    });
  };

  // Salvar alterações
  const handleSaveChanges = async () => {
    if (!editingDay) return;

    try {
      // Extrair data no formato yyyy-MM-dd
      const [dia, mes, ano] = editingDay.date.split('/');
      const requestDate = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;

      // Preparar dados para envio
      const payload = {
        requestDate,
        entryTime: editedTimes.ENTRY || null,
        lunchStartTime: editedTimes.LUNCH_START || null,
        lunchEndTime: editedTimes.LUNCH_END || null,
        exitTime: editedTimes.EXIT || null,
        justification: "Solicitação de ajuste de horário"
      };

      console.log("📤 Enviando solicitação:", payload);
      
      await api.post("/api/v1/clock-adjustments", payload);
      
      alert(`✅ Solicitação de ajuste enviada com sucesso!\n\nData: ${editingDay.date}\n\nOs administradores serão notificados e avaliarão sua solicitação.`);
      
      handleCloseModal();
    } catch (error) {
      console.error("❌ Erro ao enviar solicitação:", error);
      alert("Erro ao enviar solicitação de ajuste. Por favor, tente novamente.");
    }
  };

  // Atualizar tempo editado
  const handleTimeChange = (tipo: PontoTipo, value: string) => {
    setEditedTimes(prev => ({ ...prev, [tipo]: value }));
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
        ) : (
          <>
            {/* Seção: Últimos 2 Dias */}
            {ultimosDoisDias.size > 0 && (
              <div className="recent-days-section">
                <h2 className="section-title">📅 Últimos 2 Dias</h2>
                {[...ultimosDoisDias.entries()].map(([date, records]) => {
                  const weekDay = new Date(records[0].timestamp).toLocaleDateString("pt-BR", { weekday: 'long' });
                  const recordsInOrder = [...records].reverse();
                  
                  const hoje = new Date();
                  hoje.setHours(0, 0, 0, 0);
                  const pontoDate = new Date(records[0].timestamp);
                  pontoDate.setHours(0, 0, 0, 0);
                  const isToday = hoje.getTime() === pontoDate.getTime();

                  return (
                    <div key={date} className={`panel day-card ${isToday ? 'today' : 'yesterday'}`}>
                      <div className="day-header">
                        <div className="day-title-group">
                          <span className="day-date">{date}</span>
                          <span className="day-weekday">{weekDay}</span>
                          {isToday && <span className="today-badge">Hoje</span>}
                        </div>
                        <button className="adjust-btn" onClick={() => handleAdjustRequest(date, records)}>
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
                              <span className={`point-time ${!record ? 'empty' : 'filled'}`}>
                                {record ? formatTime(record.timestamp) : "--:--"}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Seção: Histórico do Mês */}
            <div className="month-history-section">
              <h2 className="section-title">📆 Histórico de {formatMonthYear(currentMonth)}</h2>
              
              {groupedPontos.size === 0 ? (
                <div className="state-message">
                  <span>Nenhum registro encontrado para este mês.</span>
                </div>
              ) : (
                [...groupedPontos.entries()]
                  .filter(([date]) => {
                    // Filtrar os últimos 2 dias da seção de histórico do mês
                    const hoje = new Date();
                    hoje.setHours(0, 0, 0, 0);
                    const [dia, mes, ano] = date.split('/');
                    const recordDate = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
                    recordDate.setHours(0, 0, 0, 0);
                    const diffDays = Math.floor((hoje.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
                    return diffDays > 1; // Apenas registros com mais de 1 dia atrás
                  })
                  .map(([date, records]) => {
                  const weekDay = new Date(records[0].timestamp).toLocaleDateString("pt-BR", { weekday: 'long' });
                  const recordsInOrder = [...records].reverse();

                  return (
                    <div key={date} className="panel day-card">
                      <div className="day-header">
                        <div className="day-title-group">
                          <span className="day-date">{date}</span>
                          <span className="day-weekday">{weekDay}</span>
                        </div>
                        <button className="adjust-btn" onClick={() => handleAdjustRequest(date, records)}>
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
          </>
        )}
      </div>

      {/* Modal de Edição */}
      {editingDay && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Ajustar Pontos - {editingDay.date}</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <p className="modal-description">
                Ajuste os horários dos pontos registrados neste dia. Deixe em branco os pontos que não deseja alterar.
              </p>
              
              <div className="time-inputs">
                {PONTOS_DO_DIA.map((tipo) => {
                  const { label, icon: PontoIcon } = pontoTipoMap[tipo];
                  return (
                    <div key={tipo} className="time-input-group">
                      <label>
                        <PontoIcon size={16} />
                        <span>{label}</span>
                      </label>
                      <input
                        type="time"
                        value={editedTimes[tipo]}
                        onChange={(e) => handleTimeChange(tipo, e.target.value)}
                        className="time-input"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCloseModal}>
                Cancelar
              </button>
              <button className="save-btn" onClick={handleSaveChanges}>
                <Save size={16} />
                Salvar Ajuste
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Frequency;