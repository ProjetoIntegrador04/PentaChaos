import React, { useState } from "react";
import { FiSave, FiUser } from "react-icons/fi"; // Removi FiKey se não estiver usando, ou mantenha se houver outro uso
import "../../styles/Coordinator/Users.css";
import "../../styles/Coordinator/Settings.css";

type SettingsState = {
  name: string;
  email: string;

  locale: "pt-BR" | "en-US";

  twoFactor: boolean;
};

const initialState: SettingsState = {
  name: "Coordenador",
  email: "coordenador@empresa.com",

  locale: "pt-BR",

  twoFactor: false,
};

export default function Settings() {
  const [form, setForm] = useState<SettingsState>(initialState);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const onChange =
    <K extends keyof SettingsState>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const isCheckbox = e.target instanceof HTMLInputElement && e.target.type === "checkbox";
      setForm((prev) => ({
        ...prev,
        [key]: isCheckbox ? (e.target as HTMLInputElement).checked : (e.target as any).value,
      }));
    };

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    setSavedAt(new Date().toLocaleTimeString());
  };

  const reset = () => setForm(initialState);

  return (
    <div className="usuarios-page">
      <header className="usuarios-header">
        <h1>Configurações</h1>
        <div className="settings-actions">
          <button className="add-btn" onClick={save} disabled={saving}>
            <FiSave size={16} />
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </header>

      <div className="settings-grid">
        <section className="card settings-card">
          <div className="card-title">
            <FiUser /> <span>Perfil</span>
          </div>
          
          {/* NOME AGORA DESABILITADO */}
          <div className="form-row">
            <label>Nome</label>
            <input
              value={form.name}
              onChange={onChange("name")}
              placeholder="Seu nome"
              disabled // Adicionado para impedir edição/clique
            />
          </div>

          {/* EMAIL AGORA DESABILITADO */}
          <div className="form-row">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={onChange("email")}
              placeholder="email@exemplo.com"
              disabled // Adicionado para impedir edição/clique
            />
          </div>

          <div className="form-row">
            <label>Tipo de Conta</label>
            <input
              value="Gestor"
              readOnly
              disabled
            />
          </div>
        </section>

        {/* Preferências */}
        <section className="card settings-card">
          <div className="card-title">
            <FiUser /> <span>Preferências</span>
          </div>
          <div className="form-row">
            <label>Idioma</label>
            <select value={form.locale} onChange={onChange("locale")}>
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
            </select>
          </div>
          
          {/* A OPÇÃO DE TEMA FOI REMOVIDA DAQUI */}

        </section>
      </div>

      <div className="settings-footer">
        <button className="btn-secondary" onClick={reset}>Restaurar padrão</button>
        <span className="saved-hint">
          {savedAt ? `Salvo às ${savedAt}` : ""}
        </span>
      </div>
    </div>
  );
}