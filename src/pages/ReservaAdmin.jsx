import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/ReservaAdmin.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function ReservaAdmin() {
  const navigate = useNavigate(); // 👈 SIEMPRE ARRIBA

  const [activeTab, setActiveTab] = useState("reservas");
  const [logoutMsg, setLogoutMsg] = useState(false);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
  });

  const cerrarSesion = () => {
    setLogoutMsg(true);
    localStorage.removeItem("adminToken");
    setTimeout(() => {
      navigate("/admin/login", { replace: true });
    }, 1500);
  };

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  // ---------------- MODALES ----------------
  const [modalExito, setModalExito] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  const [modalEliminar, setModalEliminar] = useState(false);
  const [reservaAEliminar, setReservaAEliminar] = useState(null);

  const [modalConfirm, setModalConfirm] = useState(false);
  const [cursoAReiniciar, setCursoAReiniciar] = useState(null);

  const [modalFotos, setModalFotos] = useState(false);
  const [fotosActuales, setFotosActuales] = useState([]);
  const [fotoIndex, setFotoIndex] = useState(0);

  // ---------------- DATA ----------------
  const [reservas, setReservas] = useState([]);
  const [cursos, setCursos] = useState([]);

  // ---------------- MODALES ----------------
  const abrirModalEliminar = (id) => {
    setReservaAEliminar(id);
    setModalEliminar(true);
  };

  const cerrarModalEliminar = () => {
    setReservaAEliminar(null);
    setModalEliminar(false);
  };

  const abrirModalConfirm = (id) => {
    setCursoAReiniciar(id);
    setModalConfirm(true);
  };

  const cerrarModalConfirm = () => {
    setCursoAReiniciar(null);
    setModalConfirm(false);
  };

  const abrirModalFotos = (fotos, index) => {
    setFotosActuales(fotos);
    setFotoIndex(index);
    setModalFotos(true);
  };

  const cerrarModalFotos = () => setModalFotos(false);

  const siguienteFoto = () =>
    setFotoIndex((prev) => (prev + 1) % fotosActuales.length);

  const anteriorFoto = () =>
    setFotoIndex((prev) => (prev === 0 ? fotosActuales.length - 1 : prev - 1));

  // ---------------- FETCH RESERVAS ----------------
  const cargarReservas = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reservas`, {
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error("Error cargando reservas");

      const data = await res.json();
      setReservas(data);
    } catch (e) {
      setMensajeExito("Error cargando reservas");
      setModalExito(true);
    }
  };

  // ---------------- FETCH CURSOS ----------------
  const cargarCursos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/cursos`, {
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error("Error cargando cursos");

      const data = await res.json();
      setCursos(data);
    } catch (e) {
      setMensajeExito("Error cargando cursos");
      setModalExito(true);
    }
  };

  // ---------------- ACCIONES ----------------
  const eliminarReserva = async () => {
    try {
      await fetch(`${API_URL}/api/reservas/${reservaAEliminar}`, {
        method: "DELETE",
        headers: authHeaders(), // ✅ FIX
      });

      setReservas((prev) => prev.filter((r) => r.id !== reservaAEliminar));
      setMensajeExito("Reserva eliminada correctamente");
      setModalExito(true);
    } catch {
      setMensajeExito("Error eliminando reserva");
      setModalExito(true);
    }
    cerrarModalEliminar();
  };

  const confirmarReinicio = async () => {
    try {
      await fetch(`${API_URL}/api/cursos/${cursoAReiniciar}/reiniciar`, {
        method: "PUT",
        headers: authHeaders(), // ✅ FIX
      });

      cargarCursos();
      setMensajeExito("Cupos reiniciados correctamente");
      setModalExito(true);
    } catch {
      setMensajeExito("Error reiniciando curso");
      setModalExito(true);
    }
    cerrarModalConfirm();
  };

  const eliminarInscripcion = async (id) => {
    try {
      await fetch(`${API_URL}/api/inscripciones/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      setInscripciones((prev) => prev.filter((i) => i.id !== id));
      setMensajeExito("Inscripción eliminada correctamente");
      setModalExito(true);
    } catch {
      setMensajeExito("Error eliminando inscripción");
      setModalExito(true);
    }
  };

  // ---------------- USE EFFECT ----------------
  const fetchRef = useRef(false);
  useEffect(() => {
    if (!fetchRef.current) {
      cargarReservas();
      cargarCursos();
      fetchRef.current = true;
    }
  }, []);

  // ---------------- Mostrar Inscritos--------------

  // ---------------- Mostrar Inscritos--------------
  const [inscripciones, setInscripciones] = useState([]);

  const cargarInscripciones = async () => {
    const res = await fetch(`${API_URL}/api/inscripciones`, {
      headers: authHeaders(),
    });

    if (!res.ok) throw new Error("Error cargando inscripciones");

    const data = await res.json();
    setInscripciones(data);
  };

  useEffect(() => {
    if (activeTab === "inscripciones") {
      cargarInscripciones();
    }
  }, [activeTab]);

  // ---------------- RENDER ----------------
  return (
    <div className="admin-panel-container">
      {/* HEADER */}
      <div className="admin-header">
        <h2>Panel Administrativo</h2>
        <button className="btn-logout" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>

      {/* TABS */}
      <div className="tabs">
        <button
          className={activeTab === "reservas" ? "active" : ""}
          onClick={() => setActiveTab("reservas")}
        >
          Reservas
        </button>
        <button
          className={activeTab === "cursos" ? "active" : ""}
          onClick={() => setActiveTab("cursos")}
        >
          Cursos
        </button>

        <button
          className={activeTab === "inscripciones" ? "active" : ""}
          onClick={() => setActiveTab("inscripciones")}
        >
          Inscripciones
        </button>
      </div>

      {/* ================= RESERVAS ================= */}
      {activeTab === "reservas" && (
        <div>
          {reservas.map((r) => (
            <div key={r.id} className="reserva-card">
              <h3>{r.nombre}</h3>
              <p>Email: {r.email}</p>
              <p>Teléfono: {r.telefono}</p>
              <p>Fecha: {r.fecha}</p>
              <p>Hora: {r.hora}</p>
              <p>Tipo de cabello: {r.tipoCabello || "-"}</p>
              <p>Textura: {r.textura || "-"}</p>
              <p>Cuero cabelludo: {r.cueroCabelludo || "-"}</p>

              <p>
                Rutina:{" "}
                {Array.isArray(r.rutinaLista) && r.rutinaLista.length > 0
                  ? r.rutinaLista.join(", ")
                  : "-"}
              </p>

              <p>
                Productos:{" "}
                {Array.isArray(r.productosLista) && r.productosLista.length > 0
                  ? r.productosLista.join(", ")
                  : "-"}
              </p>

              <p>Objetivo: {r.objetivo || "-"}</p>

              <div className="fotos-container">
                {r.fotosLista?.length > 0 ? (
                  r.fotosLista.map((f, i) => (
                    <img
                      key={i}
                      src={f}
                      alt="Foto reserva"
                      className="foto-reserva"
                      onClick={() => abrirModalFotos(r.fotosLista, i)}
                    />
                  ))
                ) : (
                  <p className="sin-fotos">Sin fotos</p>
                )}
              </div>

              <button
                className="btn-eliminar"
                onClick={() => abrirModalEliminar(r.id)}
              >
                Eliminar reserva
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= Inscripciones ================= */}
      {activeTab === "inscripciones" && (
        <div>
          {inscripciones.map((i) => (
            <div key={i.id} className="reserva-card">
              <h3>{i.nombre}</h3>
              <p>Email: {i.email}</p>
              <p>Teléfono: {i.telefono}</p>
              <p>Curso: {i.curso}</p>
              <p>Fecha: {i.fechaRegistro}</p>
              <p>Comentario: {i.comentario || "-"}</p>
              <p>Precio: ${i.precio?.toLocaleString() ?? "-"}</p>

              <button
                className="btn-eliminar"
                onClick={() => eliminarInscripcion(i.id)}
              >
                Eliminar inscripción
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= CURSOS ================= */}
      {activeTab === "cursos" && (
        <div>
          {cursos.map((c) => (
            <div key={c.id} className="curso-admin-card">
              <h3>{c.nombre}</h3>
              <p>Cupo Máximo: {c.cupoMaximo}</p>
              <p>Cupo Disponible: {c.cupoDisponible}</p>
              <button
                className="btn-reiniciar"
                onClick={() => abrirModalConfirm(c.id)}
              >
                Reiniciar cupo
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODALES ================= */}
      {modalExito && (
        <div className="modal-success-overlay">
          <div className="modal-success">
            <div className="icon">✔</div>
            <p>{mensajeExito}</p>
            <button onClick={() => setModalExito(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {modalEliminar && (
        <div className="modal-success-overlay">
          <div className="modal-success">
            <p>¿Eliminar esta reserva?</p>
            <div className="modal-buttons">
              <button className="btn-confirm" onClick={eliminarReserva}>
                Sí
              </button>
              <button className="btn-cancel" onClick={cerrarModalEliminar}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalConfirm && (
        <div className="modal-success-overlay">
          <div className="modal-success">
            <p>¿Reiniciar cupos?</p>
            <div className="modal-buttons">
              <button className="btn-confirm" onClick={confirmarReinicio}>
                Sí
              </button>
              <button className="btn-cancel" onClick={cerrarModalConfirm}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalFotos && (
        <div className="modal-fotos" onClick={cerrarModalFotos}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={cerrarModalFotos}>
              ✖
            </button>
            <img src={fotosActuales[fotoIndex]} alt="" />
            <button className="prev" onClick={anteriorFoto}>
              ⟵
            </button>
            <button className="next" onClick={siguienteFoto}>
              ⟶
            </button>
          </div>
        </div>
      )}

      {logoutMsg && (
        <div className="modal-success-overlay">
          <div className="modal-success">
            <div className="icon">✔</div>
            <p>Sesión cerrada correctamente</p>
          </div>
        </div>
      )}
    </div>
  );
}
