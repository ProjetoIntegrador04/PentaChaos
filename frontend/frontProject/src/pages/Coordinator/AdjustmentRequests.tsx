import React, { useState, useEffect } from "react";
import { Check, X, Clock, Calendar, User, FileText, RefreshCw } from "lucide-react";
import api from "../../api/https";
import "../../styles/Coordinator/AdjustmentRequests.css";

interface AdjustmentRequest {
  id: number;
  userId: number;
  username: string;
  fullName: string;
  requestDate: string;
  entryTime: string | null;
  lunchStartTime: string | null;
  lunchEndTime: string | null;
  exitTime: string | null;
  justification: string | null;
  status: string;
  reviewedBy: number | null;
  reviewedByName: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

const AdjustmentRequests: React.FC = () => {
  const [requests, setRequests] = useState<AdjustmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending">("pending");

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const endpoint = filter === "pending" 
        ? "/api/v1/clock-adjustments/pending"
        : "/api/v1/clock-adjustments";
      
      const res = await api.get<AdjustmentRequest[]>(endpoint);
      console.log("📋 Solicitações carregadas:", res.data);
      setRequests(res.data);
    } catch (error) {
      console.error("❌ Erro ao carregar solicitações:", error);
      alert("Erro ao carregar solicitações. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (requestId: number, action: "approve" | "reject") => {
    const confirmMessage = action === "approve"
      ? "Tem certeza que deseja APROVAR esta solicitação?"
      : "Tem certeza que deseja REJEITAR esta solicitação?";

    if (!window.confirm(confirmMessage)) return;

    try {
      await api.put(`/api/v1/clock-adjustments/${requestId}/review?action=${action}`);
      alert(action === "approve" ? "✅ Solicitação aprovada!" : "❌ Solicitação rejeitada!");
      loadRequests(); // Recarregar lista
    } catch (error) {
      console.error("❌ Erro ao processar solicitação:", error);
      alert("Erro ao processar solicitação. Tente novamente.");
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      weekday: "long"
    });
  };

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString("pt-BR");
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: { label: "Pendente", class: "status-pending" },
      APPROVED: { label: "Aprovada", class: "status-approved" },
      REJECTED: { label: "Rejeitada", class: "status-rejected" },
    };
    return badges[status as keyof typeof badges] || badges.PENDING;
  };

  return (
    <div className="adjustment-requests-page">
      <header className="page-header">
        <h1>📋 Solicitações de Ajuste de Ponto</h1>
        <button className="refresh-btn" onClick={loadRequests}>
          <RefreshCw size={16} />
          Atualizar
        </button>
      </header>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          <Clock size={16} />
          Pendentes ({requests.filter(r => r.status === "PENDING").length})
        </button>
        <button
          className={`filter-tab ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          <FileText size={16} />
          Todas
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <RefreshCw className="spin" size={32} />
          <p>Carregando solicitações...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} />
          <p>Nenhuma solicitação encontrada</p>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map((request) => {
            const statusBadge = getStatusBadge(request.status);
            return (
              <div key={request.id} className={`request-card ${request.status.toLowerCase()}`}>
                <div className="card-header">
                  <div className="user-info">
                    <User size={20} />
                    <div>
                      <strong>{request.fullName}</strong>
                      <span className="username">@{request.username}</span>
                    </div>
                  </div>
                  <span className={`status-badge ${statusBadge.class}`}>
                    {statusBadge.label}
                  </span>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <Calendar size={16} />
                    <div>
                      <span className="label">Data da Solicitação:</span>
                      <strong>{formatDate(request.requestDate)}</strong>
                    </div>
                  </div>

                  <div className="times-grid">
                    <div className="time-item">
                      <span className="time-label">🟢 Entrada</span>
                      <span className="time-value">{request.entryTime || "--:--"}</span>
                    </div>
                    <div className="time-item">
                      <span className="time-label">🟡 Início Pausa</span>
                      <span className="time-value">{request.lunchStartTime || "--:--"}</span>
                    </div>
                    <div className="time-item">
                      <span className="time-label">🟡 Fim Pausa</span>
                      <span className="time-value">{request.lunchEndTime || "--:--"}</span>
                    </div>
                    <div className="time-item">
                      <span className="time-label">🔴 Saída</span>
                      <span className="time-value">{request.exitTime || "--:--"}</span>
                    </div>
                  </div>

                  {request.justification && (
                    <div className="justification">
                      <span className="label">Justificativa:</span>
                      <p>{request.justification}</p>
                    </div>
                  )}

                  <div className="metadata">
                    <span>Solicitado em: {formatDateTime(request.createdAt)}</span>
                    {request.reviewedAt && (
                      <span>Revisado em: {formatDateTime(request.reviewedAt)} por {request.reviewedByName}</span>
                    )}
                  </div>
                </div>

                {request.status === "PENDING" && (
                  <div className="card-actions">
                    <button
                      className="approve-btn"
                      onClick={() => handleReview(request.id, "approve")}
                    >
                      <Check size={16} />
                      Aprovar
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleReview(request.id, "reject")}
                    >
                      <X size={16} />
                      Rejeitar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdjustmentRequests;
