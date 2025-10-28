import React, { useState } from "react";
import { FiEdit, FiCheck, FiChevronLeft, FiChevronRight } from "react-icons/fi"; 
import "../../styles/Coordinator/Frequency.css"; 

type TimeLog = string | null;

interface UserFrequency {
  id: number;
  status: "ATIVO" | "INATIVO";
  nome: string;
  pontos: [TimeLog, TimeLog, TimeLog, TimeLog];
}

const mockFrequency: UserFrequency[] = [
  { id: 1, status: "ATIVO", nome: "David Franco", pontos: ["9h00", "12h00", "13h00", "16h00"] },
  { id: 2, status: "ATIVO", nome: "Maria Souza", pontos: ["9h05", "12h10", null, null] },
  { id: 3, status: "INATIVO", nome: "João Silva", pontos: [null, null, null, null] },
  { id: 4, status: "ATIVO", nome: "Thóris Medeiros", pontos: ["8h58", "11h55", "13h02", "16h05"] },
  { id: 5, status: "ATIVO", nome: "Carlos Eduardo", pontos: ["9h01", "12h00", "13h00", null] },
  { id: 6, status: "ATIVO", nome: "Ana Pereira", pontos: ["9h00", "12h00", "13h00", "16h00"] },
  { id: 7, status: "ATIVO", nome: "Lucas Martins", pontos: ["9h15", null, null, null] },
];

const Frequency: React.FC = () => {
  const [frequencyData, setFrequencyData] = useState<UserFrequency[]>(mockFrequency);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

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
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Nome</th>
              <th>Ponto 1</th>
              <th>Ponto 2</th>
              <th>Ponto 3</th>
              <th>Ponto 4</th>
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
                  <button className="icon-btn approve">
                    <FiCheck />
                  </button>
                  <button className="icon-btn edit">
                    <FiEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Frequency;