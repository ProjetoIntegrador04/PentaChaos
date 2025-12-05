import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Coordinator/Dashboard.css";
import SmartCarousel from "../../components/Dashboard/SmartCarousel";
import FrequencyDonut from "../../components/Dashboard/FrequencyDonut";
import MembersList from "../../components/Dashboard/MembersList";
import api from "../../api/https";

interface Role {
  id: number;
  name: string;
}

interface Usuario {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  ra?: string;
  squad?: string;
  phoneNumber?: string;
  enabled: boolean;
  roles: Role[];
}

type SquadData = {
  id: string;
  name: string;
  color: string;
  members: Usuario[];
  freq: { present: number; absent: number }; 
};

type Range = "7" | "30" | "90";

// Cores para as squads
const SQUAD_COLORS: Record<string, string> = {
  "LSD": "#3b82f6",
  "INFRA": "#2563eb",
  "CASE": "#1d4ed8",
  "404": "#1e40af",
  "CLOUD": "#8b5cf6",
  "BACKEND": "#10b981",
  "FRONTEND": "#f59e0b",
  "MOBILE": "#ef4444",
  "DEFAULT": "#6b7280"
};

// Função para calcular dias úteis no mês (segunda a sexta) - removida pois não está sendo usada
// TODO: Implementar quando necessário para cálculos de frequência real

// Função para calcular frequência de um usuário no período
function calculateUserFrequency(userId: number, range: Range): number {
  // TODO: Implementar busca real de pontos do backend
  // Por enquanto, retorna um valor aleatório para demonstração
  const baseFreq = 70 + Math.random() * 25; // Entre 70% e 95%
  const mul = range === "7" ? 1.05 : range === "90" ? 0.95 : 1;
  return Math.min(100, Math.max(0, Math.round(baseFreq * mul)));
}

export default function DashboardV2() {
  const navigate = useNavigate();
  // const [usuarios, setUsuarios] = useState<Usuario[]>([]); // Removido - não usado diretamente
  const [squads, setSquads] = useState<SquadData[]>([]);
  const [activeSquad, setActiveSquad] = useState<SquadData | null>(null);
  const [range, setRange] = useState<Range>("30");
  const [selectedMember, setSelectedMember] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuários do backend
  useEffect(() => {
    const loadUsers = async () => {
      try {
        console.log("📡 Loading users for dashboard...");
        const res = await api.get("/api/v1/users");
        const users = res.data as Usuario[];
        
        console.log("✅ Users loaded:", users);
        // setUsuarios(users); // Removido - não necessário pois usamos direto os users

        // Agrupar usuários por squad
        const squadMap = new Map<string, Usuario[]>();
        
        users.forEach(user => {
          const squadName = user.squad || "Sem Squad";
          if (!squadMap.has(squadName)) {
            squadMap.set(squadName, []);
          }
          squadMap.get(squadName)!.push(user);
        });

        // Criar array de squads
        const squadsArray: SquadData[] = Array.from(squadMap.entries()).map(([name, members]) => {
          const color = SQUAD_COLORS[name.toUpperCase()] || SQUAD_COLORS.DEFAULT;
          
          // Calcular frequência média da squad (simplificado)
          const avgFreq = members.length > 0
            ? members.reduce((sum, m) => sum + calculateUserFrequency(m.id, "30"), 0) / members.length
            : 0;
          
          return {
            id: name.toLowerCase().replace(/\s+/g, "-"),
            name,
            color,
            members,
            freq: {
              present: Math.round(avgFreq),
              absent: 100 - Math.round(avgFreq)
            }
          };
        });

        console.log("📊 Squads created:", squadsArray);
        setSquads(squadsArray);
        
        if (squadsArray.length > 0) {
          setActiveSquad(squadsArray[0]);
        }
      } catch (err) {
        console.error("❌ Error loading users:", err);
        alert("Erro ao carregar dados do dashboard.");
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);

  // Recalcular frequência quando mudar o range
  const freqForRange = useMemo(() => {
    if (!activeSquad) return { present: 0, absent: 100 };
    
    const base = activeSquad.freq;
    const mul = range === "7" ? 1.02 : range === "90" ? 0.95 : 1;
    const present = Math.min(100, Math.max(0, Math.round(base.present * mul)));
    const absent = 100 - present;
    return { present, absent };
  }, [activeSquad, range]);

  if (loading) {
    return (
      <div className="dashv2">
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (squads.length === 0) {
    return (
      <div className="dashv2">
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Nenhum usuário cadastrado ainda.</p>
        </div>
      </div>
    );
  }

  if (!activeSquad) {
    return (
      <div className="dashv2">
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Selecione uma squad.</p>
        </div>
      </div>
    );
  }

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
          items={squads.map((s) => ({
            key: s.id,
            title: `${s.name} Squad`,
            subtitle: `${s.members.length} ${s.members.length === 1 ? 'Integrante' : 'Integrantes'}`,
            color: s.color,
          }))}
          onActiveChange={(key) => {
            const s = squads.find((sq) => sq.id === key);
            if (s) {
              setActiveSquad(s);
              setSelectedMember(null);
            }
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
            members={activeSquad.members.map(m => m.fullName || m.username)}
            selected={selectedMember ? (selectedMember.fullName || selectedMember.username) : null}
            onSelect={(name) => {
              if (name === null) {
                setSelectedMember(null);
              } else {
                const member = activeSquad.members.find(
                  m => (m.fullName || m.username) === name
                );
                setSelectedMember(member || null);
              }
            }}
          />
          <div className="panel-footer">
            <button
              className="btn primary"
              onClick={() => {
                alert(`Relatório da squad ${activeSquad.name} será gerado...`);
                // TODO: Implementar geração de relatório real
              }}
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
