import React, { useState } from "react";
import { FiUser, FiLogOut, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./FrequencyChart.css";

type Props = {
  onViewDetails?: () => void;
};

const FrequencyChart: React.FC<Props> = ({ onViewDetails }) => {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const [activeIndex, setActiveIndex] = useState(new Date().getMonth()); // começa no mês atual

  const prevMonth = () => {
    setActiveIndex((prev) => (prev - 1 + months.length) % months.length);
  };

  const nextMonth = () => {
    setActiveIndex((prev) => (prev + 1) % months.length);
  };

  return (
    <div className="frequency-chart-card">
      <div className="chart-header">
        <h3>Frequência</h3>

        {/* 🔹 Seletor de mês com setas */}
        <div className="month-selector">
          <button className="arrow-btn" onClick={prevMonth} aria-label="Mês anterior">
            <FiChevronLeft />
          </button>
          <span className="month-label">{months[activeIndex]}</span>
          <button className="arrow-btn" onClick={nextMonth} aria-label="Próximo mês">
            <FiChevronRight />
          </button>
        </div>

      </div>

      {/* 🔹 Gráfico */}
      <div className="pie-chart">
        <svg width="180" height="180" viewBox="0 0 180 180" role="img" aria-label="Gráfico de presença e faltas">
          <circle cx="90" cy="90" r="70" fill="none" stroke="#e2e8f0" strokeWidth="20" />
          <circle
            cx="90" cy="90" r="70" fill="none" stroke="#2563eb" strokeWidth="20"
            strokeDasharray="318" strokeDashoffset="80" strokeLinecap="round"
            transform="rotate(-90 90 90)"
          />
          <circle
            cx="90" cy="90" r="70" fill="none" stroke="#f97316" strokeWidth="20"
            strokeDasharray="80" strokeDashoffset="0" strokeLinecap="round"
            transform="rotate(148 90 90)"
          />
        </svg>
      </div>

      {/* 🔹 Legenda */}
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color presencas" />
          <span>Presenças</span>
        </div>
        <div className="legend-item">
          <div className="legend-color faltas" />
          <span>Faltas</span>
        </div>
      </div>

      {/* 🔹 Botão detalhes */}
      <div className="chart-actions">
        <button
          className="details-btn"
          onClick={onViewDetails}
          aria-label="Ver detalhes de frequência"
        >
          Ver detalhes
        </button>
      </div>
    </div>
  );
};

export default FrequencyChart;
