import { useState, useEffect } from "react";
import "./styles/Cursos.css";
import RutinaReales from "../assets/PAGINA (2).png";

const API_URL = import.meta.env.VITE_API_URL; // ✅ AQUÍ

export default function Cursos({ carrito, setCarrito, setNuevoItem }) {
  const [open, setOpen] = useState({ personalizado: false });
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [cursoPersonalizado, setCursoPersonalizado] = useState(null);
  const [cursoLlenoModal, setCursoLlenoModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    comentario: "",
  });

  // =============================
  // CARGAR CURSO
  // =============================
  useEffect(() => {
    async function fetchCurso() {
      try {
        const res = await fetch(`${API_URL}/api/cursos/1`);
        if (!res.ok) throw new Error("Error al cargar curso");
        const data = await res.json();
        setCursoPersonalizado(data);
      } catch (error) {
        console.error("Error cargando curso:", error);
      }
    }
    fetchCurso();
  }, []);

  // =============================
  // FORMULARIO
  // =============================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cursoPersonalizado) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/api/cursos/${cursoPersonalizado.id}/inscribirse`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: formData.nombre,
            email: formData.email,
            telefono: formData.telefono,
            comentario: formData.comentario,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (data.message === "Cupos agotados") {
          setCursoLlenoModal(true);
          return;
        }
        alert(data.message || "Error al inscribirse");
        return;
      }

      // ✅ AGREGAR AL CARRITO
      setCarrito((prev) => [
        ...prev,
        {
          id: cursoPersonalizado.id,
          nombre: cursoPersonalizado.nombre,
          tipo: "Masterclass personalizada",
        },
      ]);

      setNuevoItem && setNuevoItem(true);

      // ✅ ACTUALIZAR CUPO EN UI
      setCursoPersonalizado((prev) => ({
        ...prev,
        cupoDisponible: prev.cupoDisponible - 1,
      }));

      setShowSuccessModal(true);
      setFormSubmitted(true);
      setShowForm(false);

      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        comentario: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }

    setLoading(false);
  };

  // ---------- Carrito ---------------

  // =============================
  // RENDER
  // =============================
  return (
    <div className="cursos-container">
      <h2>Cursos disponibles</h2>

      <div className="cursos-grid">
        {/* ================= MASTERCLASS PERSONALIZADA ================= */}
        <div className="curso-card">
          <video
            src="/videos/MASTERCLASS.mp4"
            controls
            className="curso-video"
            poster="https://placehold.co/400x250?text=Cargando+video"
          />

          <h3>{cursoPersonalizado?.nombre || "Masterclass personalizada"}</h3>

          <p>
            Aprende a conocer, entender y transformar tu cabello desde cero.
          </p>

          {cursoPersonalizado && (
            <p className="curso-capacidad">
              Cupos disponibles: {cursoPersonalizado.cupoDisponible}
            </p>
          )}

          <button
            className="btn-ver-mas"
            onClick={() => setOpen({ personalizado: !open.personalizado })}
          >
            {open.personalizado ? "Ver menos" : "Ver más"}
          </button>

          {open.personalizado && (
            <div className="curso-detalle">
              <p>
                Esta masterclass está diseñada para ayudarte a comprender tu
                tipo de cabello y crear una rutina efectiva y personalizada.
              </p>

              <ul>
                <li>Análisis de tu cabello</li>
                <li>Rutina personalizada</li>
                <li>Revisión de productos</li>
                <li>Acompañamiento profesional</li>
              </ul>

              {!showForm && !formSubmitted && (
                <button
                  className="btn-inscribirse"
                  onClick={() => setShowForm(true)}
                  disabled={
                    !cursoPersonalizado ||
                    cursoPersonalizado.cupoDisponible <= 0
                  }
                >
                  {!cursoPersonalizado
                    ? "Cargando..."
                    : cursoPersonalizado.cupoDisponible <= 0
                    ? "Curso lleno"
                    : "Inscribirse"}
                </button>
              )}

              {showForm && (
                <form className="inscripcion-form" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre completo"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="Teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                  />
                  <textarea
                    name="comentario"
                    placeholder="Comentario (opcional)"
                    value={formData.comentario}
                    onChange={handleChange}
                  />
                  <button type="submit" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar inscripción"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* ================= CURSO HOTMART ================= */}
        <div className="curso-card">
          <img
            src={RutinaReales} // o la URL que quieras
            alt="Curso online de cuidado capilar"
            className="curso-video"
          />

          <h3>Rutinas reales para Rizos reales</h3>

          <p>
            Un curso grabado paso a paso donde aprenderás a cuidar, entender y
            transformar tu cabello desde casa, a tu ritmo.
          </p>

          <div className="curso-detalle">
            <ul className="curso-lista">
              <li>Clases 100% grabadas</li>
              <li>Acceso inmediato</li>
              <li>Disponible 24/7</li>
              <li>Plataforma Hotmart</li>
            </ul>
          </div>

          <a
            href="https://go.hotmart.com/I103185148E?dp=1"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-inscribirse"
          >
            Ir al curso
          </a>
        </div>
      </div>

      {/* ================= MODAL CURSO LLENO ================= */}
      {cursoLlenoModal && (
        <div
          className="modal-overlay"
          onClick={() => setCursoLlenoModal(false)}
        >
          <div className="modal-curso-lleno">
            <h2>Cupos agotados</h2>
            <p>Este curso ya no tiene cupos disponibles.</p>
            <button onClick={() => setCursoLlenoModal(false)}>Entendido</button>
          </div>
        </div>
      )}

      {/* ================= MODAL ÉXITO ================= */}
      {showSuccessModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowSuccessModal(false)}
        >
          <div className="modal">
            <h2>¡Inscripción enviada!</h2>
            <p>
              Tu inscripción ha sido registrada correctamente. Por favor
              confirma tu carrito para confirmar tu inscripción.
            </p>
            <button onClick={() => setShowSuccessModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
