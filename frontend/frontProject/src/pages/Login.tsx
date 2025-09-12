import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import "../styles/login.css";
import logoImage from "../assets/images/image.png";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password, rememberMe });
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="welcome-content">
          <div className="logo-section">
            <img src={logoImage} alt="2RP net Logo" className="logo-image" />
          </div>
          <div className="welcome-message">
            <h1>Olá,</h1>
            <h2>Bem vindo a</h2>
            <p className="description">
              2RP net Monitoring, onde o gerenciamento, acompanhamento,
              organizado é possível!
            </p>
          </div>
          <button className="learn-more-btn">Saber mais ▶</button>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <div className="form-header">
            <h2>Entre na sua</h2>
            <h2 className="account-text">conta agora!</h2>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                />
                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="show-password-icon" />
                  ) : (
                    <EyeIcon className="show-password-icon" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Lembrar-me
              </label>
              <button type="button" className="forgot-password-link">
                Esqueci minha senha
              </button>
            </div>

            <button type="submit" className="login-btn">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;