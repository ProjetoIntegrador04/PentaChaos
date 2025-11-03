import React, { useState } from "react";
import { FiSave, FiKey, FiUser } from "react-icons/fi";
import "../../styles/Coordinator/Users.css"; // Pode reutilizar este se for comum
import "../../styles/Intern/Settings.css";    // 1. Caminho do CSS atualizado

type SettingsState = {
  // Perfil
  name: string;
  email: string;

  // Preferências
  locale: "pt-BR" | "en-US";
  theme: "light" | "dark";

  twoFactor: boolean;
};

// 2. Dados iniciais atualizados para o Estagiário
const initialState: SettingsState = {
  name: "Pablo", // Usando seu nome
  email: "pablo.estagiario@2rpnet.com.br", // Exemplo
  locale: "pt-BR",
  theme: "light",
  twoFactor: false,
};

// 3. Nome do componente atualizado
export default function InternSettings() {
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
    await new Promise((r) => setTimeout(r, 700)); // Simula chamada de API
    setSaving(false);
    setSavedAt(new Date().toLocaleTimeString());
  };

  const reset = () => setForm(initialState);

  return (
    // 4. Título da página atualizado
    <div className="usuarios-page">
      <header className="usuarios-header">
        <h1>Minhas Configurações</h1>
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
            <FiUser /> <span>Meu Perfil</span>
          </div>
          <div className="form-row">
            <label>Nome</label>
            <input
              value={form.name}
              onChange={onChange("name")}
              placeholder="Seu nome"
            />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={onChange("email")}
              placeholder="email@exemplo.com"
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
          <div className="form-row">
            <label>Tema</label>
            <select value={form.theme} onChange={onChange("theme")}>
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
            </select>
          </div>
        </section>

        {/* Segurança */}
        <section className="card settings-card">
          <div className="card-title">
            <FiKey /> <span>Segurança</span>
          </div>

          <label className="switch-row">
            <input
              type="checkbox"
              checked={form.twoFactor}
              onChange={onChange("twoFactor")}
            />
            <span>Ativar autenticação em duas etapas (2FA)</span>
          </label>

          {/* 5. Texto do "hint" atualizado */}
          <div className="hint">Recomendado para aumentar a segurança da sua conta.</div>
        </section>
      </div>

      <div className="settings-footer">
        <button className="btn-secondary" onClick={reset}>Restaurar padrão</button>
        <span className="saved-hint">
          {savedAt ? `Salvo às ${savedAt}` : "—"}
        </span>
      </div>
    </div>
  );
}