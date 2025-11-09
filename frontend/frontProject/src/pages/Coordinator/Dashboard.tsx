import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Coordinator/Dashboard.css";
import SmartCarousel from "../../components/Dashboard/SmartCarousel";
import FrequencyDonut from "../../components/Dashboard/FrequencyDonut";
import MembersList from "../../components/Dashboard/MembersList";

type SquadData = {
  id: string;
  name: string;
  color: string;
  members: string[];
  freq: { present: number; absent: number }; 
};

const SQUADS: SquadData[] = [
  {
    id: "lsd",
    name: "LSD",
    color: "#3b82f6",
    members: [
      "Pablo Vinicius Domingues Sanches",
      "Samuel V. I. Batista",
      "Ana Carvalho",
      "João Pedro",
      "Camila Rossi",
    ],
    freq: { present: 82, absent: 18 },
  },
  {
    id: "infra",
    name: "INFRA",
    color: "#2563eb",
    members: ["Marcos Lima", "Fernanda Souza", "Diego Lopes", "Rafa Silva"],
    freq: { present: 75, absent: 25 },
  },
  {
    id: "case",
    name: "CASE",
    color: "#1d4ed8",
    members: ["Alice N.", "Bruno A.", "Cecília G.", "Gabriel T.", "Heitor M."],
    freq: { present: 90, absent: 10 },
  },
  {
    id: "404",
    name: "404",
    color: "#1e40af",
    members: ["Zeca", "Luana"],
    freq: { present: 61, absent: 39 },
  },
    {
    id: "cloud",
    name: "CLOUD",
    color: "#1e40af",
    members: ["José", "Théo"],
    freq: { present: 61, absent: 39 },
  },
];

type Range = "7" | "30" | "90";

export default function DashboardV2() {
  const navigate = useNavigate();
  const [activeSquad, setActiveSquad] = React.useState<SquadData>(SQUADS[0]);
  const [range, setRange] = React.useState<Range>("30");
  const [selectedMember, setSelectedMember] = React.useState<string | null>(null);

  const freqForRange = React.useMemo(() => {
    const base = activeSquad.freq;
    const mul = range === "7" ? 1.02 : range === "90" ? 0.95 : 1;
    const present = Math.min(100, Math.max(0, Math.round(base.present * mul)));
    const absent = 100 - present;
    return { present, absent };
  }, [activeSquad, range]);

  return (
    <div className="dashv2">
      <header className="dashv2-header">
        <h1>Dashboard</h1>
        <div className="range-switch">
          <button
            className={`chip ${range === "7" ? "active" : ""}`}
            onClick={() => setRange("7")}
          >
            7 dias
          </button>
          <button
            className={`chip ${range === "30" ? "active" : ""}`}
            onClick={() => setRange("30")}
          >
            30 dias
          </button>
          <button
            className={`chip ${range === "90" ? "active" : ""}`}
            onClick={() => setRange("90")}
          >
            90 dias
          </button>
        </div>
      </header>

      {/* Carrossel de squads */}
      <section className="panel panel-squads" aria-label="Squads">
        <SmartCarousel
          items={SQUADS.map((s) => ({
            key: s.id,
            title: `${s.name} Squad`,
            subtitle: `Integrantes ${s.members.length}`,
            color: s.color,
          }))}
          onActiveChange={(key) => {
            const s = SQUADS.find((sq) => sq.id === key)!;
            setActiveSquad(s);
            setSelectedMember(null);
          }}
          onNavigate={(key) => {
            navigate(`/squads?selected=${key}`);
          }}
        />
      </section>

      <section className="dashv2-grid dashv2-grid--two">
        <div className="panel">
          <h2>Integrantes</h2>
          <MembersList
            members={activeSquad.members}
            selected={selectedMember}
            onSelect={setSelectedMember}
          />
          <div className="panel-footer">
            <button
              className="btn primary"
              onClick={() => alert("Gerando relatório…")}
            >
              Gerar Relatório
            </button>
          </div>
        </div>

        <div className="panel">
          <h2>Frequência</h2>
          <FrequencyDonut
            present={freqForRange.present}
            absent={freqForRange.absent}
            labels={["Presenças", "Faltas"]}
            colors={[activeSquad.color, "#f59e0b"]}
          />
        </div>
      </section>
    </div>
  );
}
