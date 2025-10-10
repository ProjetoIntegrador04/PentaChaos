import React, { useState } from "react";
import { FiSave, FiKey, FiBell, FiUser, FiLink } from "react-icons/fi";

// Topo igual ao Users
import "../../styles/Coordinator/Users.css";
// Estilos específicos desta página
import "../../styles/Coordinator/Settings.css";

type SettingsState = {
  // Perfil
  name: string;
  email: string;

  // Preferências
  locale: "pt-BR" | "en-US";
  theme: "light" | "dark";
  pageSize: 10 | 20 | 50;

  // Notificações
  notifySquadChanges: boolean;
  notifyNewUsers: boolean;
  notifyWeeklyDigest: boolean;

  // Segurança
  twoFactor: boolean;

  // Integrações
  slackWebhook: string;
  googleOAuthEnabled: boolean;
};

const initialState: SettingsState = {
  name: "Coordenador",
  email: "coordenador@empresa.com",

  locale: "pt-BR",
  theme: "light",
  pageSize: 20,

  notifySquadChanges: true,
  notifyNewUsers: true,
  notifyWeeklyDigest: false,

  twoFactor: false,

  slackWebhook: "",
  googleOAuthEnabled: true,
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
    // 👉 Aqui você dispara seu PUT/PATCH para /api/settings
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    setSavedAt(new Date().toLocaleTimeString());
  };

  const reset = () => setForm(initialState);

  return (
    <div className="usuarios-page">
      {/* Topo reaproveitado do Users */}
      <header className="usuarios-header">
        <h1>Configurações</h1>
        <div className="settings-actions">
          <button className="add-btn" onClick={save} disabled={saving}>
            <FiSave size={16} />
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="settings-grid">
        {/* Perfil */}
        <section className="card settings-card">
          <div className="card-title">
            <FiUser /> <span>Perfil</span>
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
          <div className="form-row">
            <label>Itens por página</label>
            <select
              value={form.pageSize}
              onChange={(e) => setForm((p) => ({ ...p, pageSize: Number(e.target.value) as any }))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </section>

        {/* Notificações */}
        <section className="card settings-card">
          <div className="card-title">
            <FiBell /> <span>Notificações</span>
          </div>

          <label className="switch-row">
            <input
              type="checkbox"
              checked={form.notifySquadChanges}
              onChange={onChange("notifySquadChanges")}
            />
            <span>Alterações nas squads</span>
          </label>

          <label className="switch-row">
            <input
              type="checkbox"
              checked={form.notifyNewUsers}
              onChange={onChange("notifyNewUsers")}
            />
            <span>Novo usuário adicionado</span>
          </label>

          <label className="switch-row">
            <input
              type="checkbox"
              checked={form.notifyWeeklyDigest}
              onChange={onChange("notifyWeeklyDigest")}
            />
            <span>Resumo semanal</span>
          </label>
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

          <div className="hint">Recomendado para contas com privilégios de coordenação.</div>
        </section>

        {/* Integrações */}
        <section className="card settings-card">
          <div className="card-title">
            <FiLink /> <span>Integrações</span>
          </div>

          <label className="switch-row">
            <input
              type="checkbox"
              checked={form.googleOAuthEnabled}
              onChange={onChange("googleOAuthEnabled")}
            />
            <span>Login com Google</span>
          </label>

          <div className="form-row">
            <label>Slack Webhook</label>
            <input
              value={form.slackWebhook}
              onChange={onChange("slackWebhook")}
              placeholder="https://hooks.slack.com/services/..."
            />
          </div>
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
