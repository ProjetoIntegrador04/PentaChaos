import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import './TeamMembers.css';

const TeamMembers: React.FC = () => {
  const members = [
    { name: 'Pablo Vinicius Domingues Sanches', active: true },
    { name: 'Samuel Velingsthora Inacio Batista', active: true, highlighted: true },
    { name: 'Samuel Velingsthora Inacio Batista', active: true },
    { name: 'Samuel Velingsthora Inacio Batista', active: true },
  ];

  return (
    <div className="team-members-card">
      <h2>Integrantes</h2>
      
      <div className="members-list">
        {members.map((member, index) => (
          <div key={index} className={`member-item ${member.highlighted ? 'highlighted' : ''}`}>
            <div className="member-info">
              <div className="member-avatar"></div>
              <span className="member-name">{member.name}</span>
            </div>
            <button className="member-actions">
              <MoreHorizontal size={16} />
            </button>
          </div>
        ))}
      </div>
      
      <button className="generate-report-btn">
        Gerar Relatório
      </button>
    </div>
  );
};

export default TeamMembers;