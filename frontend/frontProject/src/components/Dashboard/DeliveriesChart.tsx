import React from 'react';
import './DeliveriesChart.css';

const DeliveriesChart: React.FC = () => {
  return (
    <div className="deliveries-chart-card">
      <div className="chart-header">
        <h3>Entregas</h3>
        <button className="ultimo-trimestre-btn">Último Trimestre</button>
      </div>
      
      <div className="line-chart">
        <svg width="300" height="150" viewBox="0 0 300 150">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <g stroke="#f1f5f9" strokeWidth="1">
            <line x1="0" y1="30" x2="300" y2="30" />
            <line x1="0" y1="60" x2="300" y2="60" />
            <line x1="0" y1="90" x2="300" y2="90" />
            <line x1="0" y1="120" x2="300" y2="120" />
          </g>
          
          {/* Line chart */}
          <polyline
            points="20,100 60,80 100,60 140,40 180,50 220,30 260,40 290,25"
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          <g fill="#f97316">
            <circle cx="20" cy="100" r="4" />
            <circle cx="60" cy="80" r="4" />
            <circle cx="100" cy="60" r="4" />
            <circle cx="140" cy="40" r="4" />
            <circle cx="180" cy="50" r="4" />
            <circle cx="220" cy="30" r="4" />
            <circle cx="260" cy="40" r="4" />
            <circle cx="290" cy="25" r="4" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default DeliveriesChart;