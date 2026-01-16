import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/styles/AdminLogin.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
      });

      if (!res.ok) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      const data = await res.json();

      if (!data.token) {
        setError("Error de autenticación");
        return;
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminLoginTime", Date.now().toString());

      navigate("/admin", { replace: true });
    } catch {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="admin-login-container">
      <form className="admin-login-card" onSubmit={handleLogin}>
        <h2>Panel Administrativo</h2>
        <p className="subtitle">Acceso privado</p>

        {error && <div className="error">{error}</div>}

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}
