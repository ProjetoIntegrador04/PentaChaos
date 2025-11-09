import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiMapPin, FiWifiOff, FiLoader, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
// 1. Importar componentes do react-leaflet
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet'; // Importa a biblioteca Leaflet
import api from "../../api/https"; 
import "../../styles/Intern/point.css";

// --- Tipos ---
type PontoTipo = "ENTRY" | "EXIT" | "BREAK_START" | "BREAK_END";
type GeoStatus = "idle" | "loading" | "success" | "error";

interface PontoPayload {
  userId: number;
  tipo: PontoTipo;
  latitude: number | null;
  longitude: number | null;
  precisao: number | null;
  fonte: "WEB";
  deviceId: string;
  timestamp?: string;
}

// --- Funções Auxiliares ---
function getOrCreateDeviceId(): string {
  const key = "deviceId";
  let id = localStorage.getItem(key);
  if (!id) {
    id = self.crypto?.randomUUID?.() ?? `dev-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

// Corrige problema de ícone padrão do Marker no Leaflet com Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Componente auxiliar para recentralizar o mapa quando as coordenadas mudam
const ChangeMapView = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();
  map.setView(coords, map.getZoom());
  return null;
}

// --- Componente Principal ---
const Ponto: React.FC = () => {
  const navigate = useNavigate();
  const deviceId = useMemo(getOrCreateDeviceId, []);

  const [horaAtual, setHoraAtual] = useState<string>(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  );
  const [tipoPonto, setTipoPonto] = useState<PontoTipo>("ENTRY");
  const [enviando, setEnviando] = useState(false);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [precisao, setPrecisao] = useState<number | null>(null);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [geoError, setGeoError] = useState<string | null>(null);

  const userId = 123; // TODO: Substituir

  useEffect(() => {
    const timerId = setInterval(() => {
      setHoraAtual(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const capturarLocalizacao = useCallback(() => {
    // ... (lógica de captura permanece a mesma) ...
     if (!("geolocation" in navigator)) {
      setGeoStatus("error");
      setGeoError("Geolocalização não suportada.");
      return;
    }
    setGeoStatus("loading");
    setGeoError(null);
    setLatitude(null); 
    setLongitude(null);
    setPrecisao(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setPrecisao(position.coords.accuracy ?? null);
        setGeoStatus("success");
      },
      (error) => {
        setGeoStatus("error");
        setGeoError(error.message || "Não foi possível obter a localização.");
        console.error("Erro de Geolocalização:", error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  useEffect(() => {
    capturarLocalizacao();
  }, [capturarLocalizacao]);

  const podeEnviar = tipoPonto && geoStatus === "success";

  const handleRegistrarPonto = async () => {
    // ... (lógica de envio permanece a mesma) ...
     if (!podeEnviar) return;

    const payload: PontoPayload = {
      userId,
      tipo: tipoPonto,
      latitude,
      longitude,
      precisao,
      fonte: "WEB",
      deviceId,
      timestamp: new Date().toISOString(),
    };

    setEnviando(true);
    try {
      await api.post("/pontos", payload); // AJUSTE A ROTA
      alert("Ponto registrado com sucesso!");
      navigate("/app/frequencia"); // AJUSTE A ROTA DE REDIRECIONAMENTO
    } catch (error: any) {
      console.error("Erro ao registrar ponto:", error);
      alert(error?.response?.data?.message || "Ocorreu um erro ao registrar o ponto.");
    } finally {
      setEnviando(false);
    }
  };

  // --- Renderização ---
  return (
    <div className="ponto-page">
      <header className="ponto-header">
         {/* ... (cabeçalho permanece o mesmo) ... */}
         <h1>Registrar Ponto</h1>
        <div className="header-actions">

          <button className="add-btn" onClick={capturarLocalizacao} disabled={geoStatus === 'loading'}>
            {geoStatus === 'loading' ? <FiLoader className="spin" size={16}/> : <FiMapPin size={16} />}
            {geoStatus === 'loading' ? 'Capturando...' : 'Atualizar Localização'}
          </button>
        </div>
      </header>

      <div className="ponto-toolbar">
         {/* ... (toolbar permanece a mesma) ... */}
         <div className="ponto-info">
          <div className="p-info">
            <span className="p-label"><FiClock size={12}/> Hora atual</span>
            <span className="p-value">{horaAtual}</span>
          </div>
        </div>

        <div className="ponto-controls">
          <label className="p-select">
            <span>Tipo de ponto</span>
            <select value={tipoPonto} onChange={(e) => setTipoPonto(e.target.value as PontoTipo)}>
              <option value="ENTRY">Entrada</option>
              <option value="EXIT">Saída</option>
              <option value="BREAK_START">Início intervalo</option>
              <option value="BREAK_END">Fim intervalo</option>
            </select>
          </label>
          <button
            className="add-btn register-btn" 
            disabled={!podeEnviar || enviando}
            onClick={handleRegistrarPonto}
          >
            {enviando ? <FiLoader className="spin" size={16} /> : <FiCheckCircle size={16} />}
            {enviando ? "Registrando..." : "Registrar Ponto"}
          </button>
        </div>
      </div>

      <div className="ponto-card ponto-map-card"> {/* Adiciona classe para estilo do mapa */}
        <div className="p-map-info-row"> {/* Container para info e status */}
          <div className="p-col">
            <span className="p-label">Precisão</span>
            <span className="p-value">{precisao ? `${Math.round(precisao)}m` : "---"}</span>
          </div>
          <div className="p-col">
            <span className={`badge ${geoStatus}`}>
              {geoStatus === "idle" && <FiWifiOff size={12} />}
              {geoStatus === "loading" && <FiLoader className="spin" size={12} />}
              {geoStatus === "success" && <FiCheckCircle size={12} />}
              {geoStatus === "error" && <FiAlertTriangle size={12} />}
              {geoStatus === "idle" && " Aguardando"}
              {geoStatus === "loading" && " Obtendo..."}
              {geoStatus === "success" && " Localização OK"}
              {geoStatus === "error" && " Erro"}
            </span>
          </div>
        </div>

        {/* 2. Renderiza o Mapa ou uma mensagem */}
        <div className="map-container">
          {geoStatus === 'success' && latitude && longitude ? (
            <MapContainer center={[latitude, longitude]} zoom={16} scrollWheelZoom={false} style={{ height: '250px', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[latitude, longitude]} />
              <ChangeMapView coords={[latitude, longitude]} /> 
            </MapContainer>
          ) : (
            <div className="map-placeholder">
              {geoStatus === 'loading' && <><FiLoader className="spin" /> Buscando localização...</>}
              {geoStatus === 'error' && <><FiAlertTriangle /> Não foi possível carregar o mapa.</>}
              {geoStatus === 'idle' && <><FiMapPin /> Mapa aparecerá aqui.</>}
            </div>
          )}
        </div>

        {geoStatus === "error" && geoError && (
          <div className="p-error">
             <FiAlertTriangle size={14}/> {geoError}
          </div>
        )}

        <div className="p-hint">
          Certifique-se que a localização do seu dispositivo está ativa para registrar o ponto.
        </div>
      </div>
    </div>
  );
};

export default Ponto;