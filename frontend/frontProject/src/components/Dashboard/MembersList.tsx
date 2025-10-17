    import React from "react";
import { Eye } from "lucide-react";
import "./MerbersList.css";

type Props = {
  members: string[];
  selected: string | null;
  onSelect: (name: string | null) => void;
};

export default function MembersList({ members, selected, onSelect }: Props) {
  const [query, setQuery] = React.useState("");

  const filtered = members.filter((m) =>
    m.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="members">
      <div className="members-search">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar integrante..."
        />
      </div>
      <ul className="members-list">
        {filtered.map((m) => {
          const isActive = selected === m;
          return (
            <li key={m} className={`member-item ${isActive ? "active" : ""}`}>
              <button className="member-chip" onClick={() => onSelect(m)}>
                {m}
              </button>
              <button
                className="member-action"
                title="ver detalhes"
                onClick={() =>
                  alert(`Detalhes de ${m} (aqui você pluga o modal real)`)
                }
              >
                <Eye size={16} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
