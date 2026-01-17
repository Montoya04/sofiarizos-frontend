import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/styles/AdminLogin.css";

// ✅ BACKEND RAILWAY
const API_URL = "https://sofiarizos-backend-production.up.railway.app";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // 🔴 ERROR DE LOGIN
      if (!res.ok) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      const data = await res.json();
      console.log("✅ LOGIN OK:", data);

      // 🔴 SEGURIDAD EXTRA
      if (!data.token) {
        setError("Respuesta inválida del servidor");
        return;
      }

      // 🔐 GUARDAR TOKEN
      localStorage.setItem("adminToken", data.token);

      // 👉 IR AL PANEL
      navigate("/admin", { replace: true });
    } catch (err) {
      console.error("❌ ERROR LOGIN:", err);
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="admin-login-container">
      <form className="admin-login-card" onSubmit={handleLogin}>
        <h2>Panel Administrativo</h2>
        <p className="subtitle">Acceso privado</p>

        {error && <div className="error">{error}</div>}

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
