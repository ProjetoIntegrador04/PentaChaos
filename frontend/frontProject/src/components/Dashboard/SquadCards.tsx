import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './SquadCards.css';

const SquadCards: React.FC = () => {
  const squads = [
    { name: 'LSD', subtitle: 'Squad', members: 5, color: '#3b82f6' },
    { name: 'INFRA', subtitle: 'Squad', members: 6, color: '#2563eb' },
    { name: 'CASE', subtitle: 'Squad', members: 9, color: '#1d4ed8' },
    { name: '404', subtitle: 'Squad', members: 2, color: '#1e40af' },
  ];

  return (
    <div className="squad-cards-container">
      <button className="nav-arrow nav-arrow-left">
        <ChevronLeft size={20} />
      </button>
      
      <div className="squad-cards">
        {squads.map((squad, index) => (
          <div key={index} className="squad-card" style={{ backgroundColor: squad.color }}>
            <div className="squad-info">
              <h3>{squad.name}</h3>
              <p>{squad.subtitle}</p>
            </div>
            <div className="squad-members">
              <div className="members-icon"></div>
              <span>Integrantes {squad.members}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="nav-arrow nav-arrow-right">
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default SquadCards;