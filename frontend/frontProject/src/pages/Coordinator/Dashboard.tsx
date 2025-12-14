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
// Cache de frequências para evitar múltiplas requisições
const frequencyCache = new Map<string, number>();

// Função ASSÍNCRONA para buscar frequência real do backend
async function fetchUserFrequency(userId: number, days: number): Promise<number> {
  const cacheKey = `${userId}-${days}`;
  
  // Verificar cache
  if (frequencyCache.has(cacheKey)) {
    return frequencyCache.get(cacheKey)!;
  }
  
  try {
    const response = await api.get(`/api/v1/clockentries/users/${userId}/frequency?days=${days}`);
    const frequency = Math.round(response.data);
    frequencyCache.set(cacheKey, frequency);
    return frequency;
  } catch (error) {
    console.error(`Erro ao buscar frequência do usuário ${userId}:`, error);
    // Retorna 0 se houver erro
    return 0;
  }
}

export default function DashboardV2() {
  const navigate = useNavigate();
  const [squads, setSquads] = useState<SquadData[]>([]);
  const [activeSquad, setActiveSquad] = useState<SquadData | null>(null);
  const [range, setRange] = useState<Range>("30");
  const [selectedMember, setSelectedMember] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [frequencies, setFrequencies] = useState<Map<string, number>>(new Map());

  // Carregar squads e membros do backend
  useEffect(() => {
    const loadSquadsWithMembers = async () => {
      try {
        console.log("📡 Loading squads with members...");
        
        // Buscar todas as squads do backend
        const squadsRes = await api.get("/api/v1/squads");
        const squadsData = squadsRes.data as Array<{
          id: number;
          name: string;
          createdAt: string;
          updatedAt: string;
          members: Usuario[];
        }>;
        
        console.log("✅ Squads loaded:", squadsData);

        // Criar squads inicialmente com frequência 0
        const squadsArray: SquadData[] = squadsData.map((squad) => {
          const color = SQUAD_COLORS[squad.name.toUpperCase()] || SQUAD_COLORS.DEFAULT;
          const members = squad.members || [];
          
          return {
            id: squad.id.toString(),
            name: squad.name,
            color,
            members,
            freq: {
              present: 0,
              absent: 100
            }
          };
        });

        console.log("📊 Squads with members created:", squadsArray);
        setSquads(squadsArray);
        
        if (squadsArray.length > 0) {
          setActiveSquad(squadsArray[0]);
        }
        
        // Carregar frequências de todos os usuários
        const days = 30; // Padrão inicial
        const freqMap = new Map<string, number>();
        
        for (const squad of squadsData) {
          for (const member of squad.members) {
            const freq = await fetchUserFrequency(member.id, days);
            freqMap.set(`${member.id}-${days}`, freq);
          }
        }
        
        setFrequencies(freqMap);
        
      } catch (err) {
        console.error("❌ Error loading squads:", err);
        alert("Erro ao carregar dados do dashboard.");
      } finally {
        setLoading(false);
      }
    };
    
    loadSquadsWithMembers();
  }, []);

  // Recarregar frequências quando o range mudar
  useEffect(() => {
    const loadFrequenciesForRange = async () => {
      if (squads.length === 0) return;
      
      const days = range === "7" ? 7 : range === "90" ? 90 : 30;
      const freqMap = new Map<string, number>();
      
      for (const squad of squads) {
        for (const member of squad.members) {
          const key = `${member.id}-${days}`;
          // Só buscar se não estiver no cache
          if (!frequencies.has(key)) {
            const freq = await fetchUserFrequency(member.id, days);
            freqMap.set(key, freq);
          } else {
            freqMap.set(key, frequencies.get(key)!);
          }
        }
      }
      
      setFrequencies(freqMap);
    };
    
    loadFrequenciesForRange();
  }, [range, squads, frequencies]);

  // Calcular frequência média da squad ativa
  const freqForRange = useMemo(() => {
    if (!activeSquad || activeSquad.members.length === 0) {
      return { present: 0, absent: 100 };
    }
    
    const days = range === "7" ? 7 : range === "90" ? 90 : 30;
    const freqs = activeSquad.members
      .map(m => frequencies.get(`${m.id}-${days}`) || 0)
      .filter(f => f > 0);
    
    if (freqs.length === 0) {
      return { present: 0, absent: 100 };
    }
    
    const avgFreq = freqs.reduce((sum, f) => sum + f, 0) / freqs.length;
    const present = Math.round(avgFreq);
    const absent = 100 - present;
    
    return { present, absent };
  }, [activeSquad, range, frequencies]);

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
        <div style={{ 
          padding: "4rem 2rem", 
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem"
        }}>
          <div style={{ fontSize: "48px" }}>📋</div>
          <h2 style={{ margin: 0, color: "#333" }}>Sem squads cadastradas</h2>
          <p style={{ color: "#666", maxWidth: "500px" }}>
            Ainda não há squads criadas no sistema. Vá até a página de Squads para criar sua primeira equipe!
          </p>
          <button 
            onClick={() => navigate('/squads')}
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1.5rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
          >
            Ir para Squads
          </button>
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
          <h2>Integrantes ({activeSquad.members.length})</h2>
          
          {/* Lista de integrantes com frequência individual */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {activeSquad.members.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                Nenhum integrante nesta squad
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeSquad.members.map((member) => {
                  const days = range === "7" ? 7 : range === "90" ? 90 : 30;
                  const freq = frequencies.get(`${member.id}-${days}`) || 0;
                  const isAdmin = member.roles.some(r => r.name === 'ROLE_ADMIN');
                  
                  return (
                    <div
                      key={member.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8eaed'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onClick={() => setSelectedMember(member)}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                          {member.fullName || member.username}
                          {isAdmin && (
                            <span style={{ 
                              marginLeft: '8px', 
                              fontSize: '10px', 
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: '#ff9800',
                              color: '#fff'
                            }}>
                              ADMIN
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {member.email}
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginLeft: '16px'
                      }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ 
                            fontSize: '18px', 
                            fontWeight: 'bold',
                            color: freq >= 75 ? '#10b981' : freq >= 50 ? '#f59e0b' : '#ef4444'
                          }}>
                            {freq}%
                          </div>
                          <div style={{ fontSize: '10px', color: '#999' }}>
                            Frequência
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Botão para gerenciar funções */}
          <button
            onClick={() => window.location.href = '/manage-roles'}
            style={{
              marginTop: '16px',
              width: '100%',
              padding: '10px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Gerenciar Squad e Funções
          </button>
        </div>

        <div className="panel" style={{ display: 'none' }}>
          <h2>Integrantes (OLD)</h2>
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
