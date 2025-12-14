import React, { useState, useEffect } from "react";
import { FiEdit, FiCheck, FiChevronLeft, FiChevronRight } from "react-icons/fi"; 
import api from "../../api/https";
import "../../styles/Coordinator/Frequency.css"; 

type TimeLog = string | null;

interface UserFrequency {
  id: number;
  status: "ATIVO" | "INATIVO";
  nome: string;
  pontos: [TimeLog, TimeLog, TimeLog, TimeLog];
}

interface Usuario {
  id: number;
  username: string;
  fullName?: string;
  enabled: boolean;
  roles: string[];
}

interface ClockEntry {
  id: number;
  tipo: "ENTRY" | "EXIT" | "LUNCH_START" | "LUNCH_END";
  timestamp: string;
}

const Frequency: React.FC = () => {
  const [frequencyData, setFrequencyData] = useState<UserFrequency[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Carregar frequência ao montar e quando mudar a data
  useEffect(() => {
    carregarFrequencia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const carregarFrequencia = async () => {
    setLoading(true);
    try {
      // 1. Buscar todos os usuários
      const resUsers = await api.get<Usuario[]>("/api/v1/users");
      console.log("📡 Usuários carregados:", resUsers.data);

      // 2. Para cada usuário, buscar pontos da data selecionada usando o novo endpoint
      const selectedDateStr = selectedDate.toISOString().split('T')[0];
      
      const frequencyPromises = resUsers.data.map(async (user) => {
        try {
          // Buscar pontos do usuário por data específica (ADMIN endpoint)
          const resHistory = await api.get<ClockEntry[]>(
            `/api/v1/clockentries/users/${user.id}/history?startDate=${selectedDateStr}&endDate=${selectedDateStr}`
          );
          
          const pontosHoje = resHistory.data;
          console.log(`📊 Pontos do usuário ${user.username}:`, pontosHoje);

          // Organizar pontos em array [ENTRY, LUNCH_START, LUNCH_END, EXIT]
          const entry = pontosHoje.find(p => p.tipo === "ENTRY");
          const lunchStart = pontosHoje.find(p => p.tipo === "LUNCH_START");
          const lunchEnd = pontosHoje.find(p => p.tipo === "LUNCH_END");
          const exit = pontosHoje.find(p => p.tipo === "EXIT");

          const formatTime = (timestamp?: string) => {
            if (!timestamp) return null;
            return new Date(timestamp).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit"
            });
          };

          const userFreq: UserFrequency = {
            id: user.id,
            status: user.enabled ? "ATIVO" : "INATIVO",
            nome: user.fullName || user.username,
            pontos: [
              formatTime(entry?.timestamp),
              formatTime(lunchStart?.timestamp),
              formatTime(lunchEnd?.timestamp),
              formatTime(exit?.timestamp)
            ]
          };

          return userFreq;
        } catch (err) {
          console.error(`❌ Erro ao buscar pontos do usuário ${user.username}:`, err);
          // Se der erro, retorna sem pontos
          return {
            id: user.id,
            status: user.enabled ? "ATIVO" : "INATIVO",
            nome: user.fullName || user.username,
            pontos: [null, null, null, null]
          } as UserFrequency;
        }
      });

      const frequency = await Promise.all(frequencyPromises);
      console.log("✅ Frequência carregada:", frequency);
      setFrequencyData(frequency);
    } catch (error) {
      console.error("❌ Erro ao carregar frequência:", error);
      alert("Erro ao carregar frequência. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const formatDate = (date: Date) => {
    const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const weekDay = days[date.getDay()];
    return `${day}/${month}/${year} - ${weekDay}`;
  };
  
  const filteredFrequency = frequencyData.filter(
    (user) => user.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="frequencia-page">
      <header className="frequencia-header">
        <h1>Frequência</h1>
        
        <div className="date-selector">
          <button onClick={handlePreviousDay} className="date-arrow-btn">
            <FiChevronLeft size={20} />
          </button>
          <span>{formatDate(selectedDate)}</span>
          <button onClick={handleNextDay} className="date-arrow-btn">
            <FiChevronRight size={20} />
          </button>
        </div>
      </header>

      <div className="search-box">
        <input
          type="text"
          placeholder="Pesquise..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="frequencia-table">
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>⏳ Carregando frequência do dia...</p>
          </div>
        ) : filteredFrequency.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Nenhum usuário encontrado.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Nome</th>
                <th>Ponto 1 (Entrada)</th>
                <th>Ponto 2 (Almoço Início)</th>
                <th>Ponto 3 (Almoço Fim)</th>
                <th>Ponto 4 (Saída)</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredFrequency.map((user) => (
                <tr key={user.id}>
                  <td className={`status ${user.status.toLowerCase()}`}>
                    {user.status}
                  </td>
                  <td>{user.nome}</td>
                  {user.pontos.map((ponto, index) => (
                    <td key={index} className="ponto">
                      {ponto || '--:--'}
                    </td>
                  ))}
                  <td className="acoes">
                    <button 
                      className="icon-btn approve"
                      title="Aprovar"
                      disabled
                    >
                      <FiCheck />
                    </button>
                    <button 
                      className="icon-btn edit"
                      title="Editar"
                      disabled
                    >
                      <FiEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Frequency;