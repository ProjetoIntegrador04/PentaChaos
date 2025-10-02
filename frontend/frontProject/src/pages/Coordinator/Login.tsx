import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import "../../styles/Coordinator/login.css";
import logoImage from "../../assets/images/image.png";
import api from "../../api/https"; 
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ backend espera usernameOrEmail e password
      const res = await api.post("/auth/login", {
        usernameOrEmail: email,
        password,
      });

      // ✅ backend retorna JwtResponseDTO
      const { accessToken, refreshToken, expiresIn } = res.data;

      if (rememberMe) {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      } else {
        sessionStorage.setItem("token", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);
      }

      console.log("Login OK:", { accessToken, expiresIn });

      navigate("/dashboard"); 
    } catch (err) {
      console.error("Erro no login:", err);
      setError("E-mail/usuário ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left-wrapper">
        <div className="login-left-background"></div>
        <div className="login-left">
          <div className="particles-background">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="particle"></div>
            ))}
          </div>
          <div className="welcome-content">
            <div className="welcome-message">
              <h1>Olá,</h1>
              <h2>Bem vindo a</h2>
              <div className="logo-section">
                <img src={logoImage} alt="2RP net Logo" className="logo-image" />
              </div>
              <p className="description">
                2RP net Monitoring, onde o gerenciamento, acompanhamento,
                organizado é possível!
              </p>
            </div>
            <button className="learn-more-btn">Saber mais ▶</button>
          </div>
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
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="E-mail ou usuário"
              />
            </div>
            <div className="input-group">
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Senha"
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
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
