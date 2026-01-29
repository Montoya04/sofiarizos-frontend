import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./styles/Reserva.css";
import { Link } from "react-router-dom";

// IMPORTAR IMAGENES
import Ondulado from "../assets/CABELLOS 2_Mesa de trabajo 1.png";
import Rizado from "../assets/CABELLOS-02.png";
import Afro from "../assets/CABELLOS 4-03.png";

const API_URL = "https://sofiarizos-backend-production.up.railway.app/api";

const MAX_FILES = 2;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// ---------------- FUNCIONES DE VALIDACIÓN ----------------
const sanitizeObject = (obj) => {
  const limpio = {};
  for (let key in obj) {
    limpio[key] = (obj[key] || "").toString().trim();
  }
  return limpio;
};

const validateReserva = (obj) => {
  const errors = {};
  if (!obj.nombre) errors.nombre = "El nombre es obligatorio";
  if (!obj.correo) errors.correo = "El correo es obligatorio";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(obj.correo))
    errors.correo = "Correo no válido";
  if (!obj.telefono) errors.telefono = "El teléfono es obligatorio";
  if (!obj.fecha) errors.fecha = "La fecha es obligatoria";
  if (!obj.hora) errors.hora = "La hora es obligatoria";
  return errors;
};

export default function ReservaCompleta() {
  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);
  const [horasOcupadas, setHorasOcupadas] = useState([]);
  const [respuestas, setRespuestas] = useState({
    tipoCabello: "",
    textura: "",
    cueroCabelludo: "",
    rutina: [],
    productos: [],
    objetivo: "",
    fotos: [],
    nombre: "",
    telefono: "",
    correo: "",
    fecha: "",
    hora: "",
  });
  const [sabados, setSabados] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const HORAS = ["07:00 AM", "08:30 AM", "10:00 AM", "11:30 AM", "01:00 PM"];

  useEffect(() => {
    const hoy = new Date();
    const diasParaSabado = (6 - hoy.getDay() + 7) % 7;
    const proximo = new Date(hoy);
    proximo.setDate(hoy.getDate() + diasParaSabado);
    const lista = [];
    for (let i = 0; i < 5; i++) {
      const f = new Date(proximo);
      f.setDate(proximo.getDate() + i * 7);
      lista.push(f);
    }
    setSabados(lista);
  }, []);

  function seleccionar(key, valor) {
    setRespuestas((r) => ({ ...r, [key]: valor }));
    setPaso((p) => p + 1);
  }

  function seleccionarMultiple(key, valor) {
    setRespuestas((r) => {
      const lista = r[key] || [];
      const existe = lista.includes(valor);
      const nuevaLista = existe
        ? lista.filter((v) => v !== valor)
        : [...lista, valor];
      return { ...r, [key]: nuevaLista };
    });
  }

  //Calcular horas disponibles
  const calcularHoras = async (fechaISO) => {
    const fecha = new Date(fechaISO);
    setRespuestas((r) => ({ ...r, fecha: fechaISO }));
    const fechaStr = fecha.toISOString().split("T")[0];

    try {
      const res = await fetch(
        `${API_URL}/reservas/horas-ocupadas?fecha=${fechaStr}`
      );

      const ocupadas = res.ok ? await res.json() : [];
      console.log("Horas ocupadas backend:", ocupadas);

      setHorasOcupadas(ocupadas);

      const ocupadasNormalizadas = ocupadas.map((h) =>
        typeof h === "string" ? h.substring(0, 5) : h.hora.substring(0, 5)
      );

      const baseHoras = [...HORAS];

      const convertirA24 = (h12) => {
        const [h, m, periodo] = h12.split(/[: ]/);
        let horas = parseInt(h);
        let minutos = parseInt(m);
        if (periodo === "PM" && horas !== 12) horas += 12;
        if (periodo === "AM" && horas === 12) horas = 0;
        return `${horas.toString().padStart(2, "0")}:${minutos
          .toString()
          .padStart(2, "0")}:00`;
      };

      const filtradas = baseHoras.filter((h) => {
        const h24 = convertirA24(h);
        return !ocupadasNormalizadas.includes(h24);
      });

      setHorasDisponibles(filtradas);
    } catch (error) {
      console.error("Error consultando horas:", error);
      setHorasDisponibles([]);
    }
  };

  const handleFiles = (files) => {
    const arr = Array.from(files).slice(0, MAX_FILES);
    for (const f of arr) {
      if (!ALLOWED_TYPES.includes(f.type)) {
        Swal.fire(
          "Error",
          "Sólo se permiten imágenes JPG, PNG o WEBP.",
          "error"
        );
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        Swal.fire("Error", "Cada imagen debe pesar menos de 5 MB.", "error");
        return;
      }
    }
    setRespuestas((r) => ({ ...r, fotos: arr }));
  };

  const validarCampos = () => {
    const limpio = sanitizeObject({
      nombre: respuestas.nombre,
      correo: respuestas.correo,
      telefono: respuestas.telefono,
      fecha: respuestas.fecha,
      hora: respuestas.hora,
    });
    const val = validateReserva(limpio);
    if (Object.keys(val).length > 0) {
      let msg = "Por favor corrige los errores:\n";
      for (const k in val) msg += "- " + val[k] + "\n";
      Swal.fire("Errores en el formulario", msg, "error");
      return false;
    }
    return true;
  };

  const handleReservaFinal = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!validarCampos()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nombre", respuestas.nombre);
      formData.append("email", respuestas.correo);
      formData.append("telefono", respuestas.telefono);
      formData.append("fecha", respuestas.fecha.substring(0, 10));

      const convertTo24H = (time) => {
        if (!time) return "";
        const [t, modifier] = time.split(" ");
        let [hours, minutes] = t.split(":");
        if (modifier === "PM" && hours !== "12")
          hours = String(parseInt(hours) + 12);
        if (modifier === "AM" && hours === "12") hours = "00";
        return `${hours.padStart(2, "0")}:${minutes}`;
      };

      const hora24 = convertTo24H(respuestas.hora) + ":00";
      formData.append("hora", hora24);
      formData.append("tipoCabello", respuestas.tipoCabello || "");
      formData.append("textura", respuestas.textura || "");
      formData.append("cueroCabelludo", respuestas.cueroCabelludo || "");
      formData.append("objetivo", respuestas.objetivo || "");
      formData.append("rutina", JSON.stringify(respuestas.rutina || []));
      formData.append("productos", JSON.stringify(respuestas.productos || []));
      (respuestas.fotos || []).forEach((f) => formData.append("fotos", f));

      const res = await fetch(`${API_URL}/reservas`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        console.error("Error al enviar reserva:", res.status, txt);

        if (res.status === 400 && txt?.includes("Cupos agotados")) {
          Swal.fire(
            "Cupos agotados",
            "Lo sentimos, no hay cupos disponibles.",
            "error"
          );
        } else {
          Swal.fire(
            "Error",
            "No se pudo enviar la reserva. Intenta más tarde.",
            "error"
          );
        }
        return;
      }

      await res.json();

      Swal.fire({
        title: "¡Reserva creada con éxito!",
        text: "Hemos recibido tu información correctamente. En breve nos pondremos en contacto para confirmar tu cita.",
        icon: "success",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#4CAF50",
      });

      setRespuestas({
        tipoCabello: "",
        textura: "",
        cueroCabelludo: "",
        rutina: [],
        productos: [],
        objetivo: "",
        fotos: [],
        nombre: "",
        telefono: "",
        correo: "",
        fecha: "",
        hora: "",
      });
      setPaso(1);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Ocurrió un error al enviar la reserva.", "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="reserva-completa-container">
      {/* ================= PASO 1 ================= */}
      {paso === 1 && (
        <div className="quiz-step">
          <h2>1. ¿Cuál es tu tipo de cabello?</h2>
          <div className="opciones">
            <div
              className="opcion"
              onClick={() => seleccionar("tipoCabello", "Ondulado (Tipo 2)")}
            >
              <img src={Ondulado} alt="ondulado" />
              <p>Ondulado (Tipo 2)</p>
            </div>
            <div
              className="opcion"
              onClick={() => seleccionar("tipoCabello", "Rizado (Tipo 3)")}
            >
              <img src={Rizado} alt="rizado" />
              <p>Rizado (Tipo 3)</p>
            </div>
            <div
              className="opcion"
              onClick={() =>
                seleccionar("tipoCabello", "Afro / Muy rizado (Tipo 4)")
              }
            >
              <img src={Afro} alt="afro" />
              <p>Afro / Muy rizado (Tipo 4)</p>
            </div>

            <div
              className="opcion"
              onClick={() => seleccionar("tipoCabello", "No estoy segura")}
            >
              <p>No estoy segura</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= PASO 2 ================= */}
      {paso === 2 && (
        <div className="quiz-step">
          <h2>2. Textura del cabello</h2>
          <div className="opciones">
            <button onClick={() => seleccionar("textura", "Fino")}>Fino</button>
            <button onClick={() => seleccionar("textura", "Medio")}>
              Medio
            </button>
            <button onClick={() => seleccionar("textura", "Grueso")}>
              Grueso
            </button>
          </div>
        </div>
      )}

      {/* ================= PASO 3 ================= */}
      {paso === 3 && (
        <div className="quiz-step">
          <h2>3. Tipo de cuero cabelludo</h2>
          <div className="opciones">
            {[
              "Seco",
              "Normal",
              "Graso",
              "Sensible",
              "Con caspa",
              "No estoy segura",
            ].map((tipo) => (
              <button
                key={tipo}
                onClick={() => seleccionar("cueroCabelludo", tipo)}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================= PASO 4 ================= */}
      {paso === 4 && (
        <div className="quiz-step">
          <h2>4. Rutina actual de cuidado</h2>
          <div className="opciones checkbox-list">
            {[
              "Lavo el cabello todos los días",
              "Lavo el cabello 2–3 veces por semana",
              "Uso productos sin sulfatos",
              "Uso productos convencionales",
              "Hago mascarillas semanalmente",
              "No tengo una rutina establecida",
            ].map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={respuestas.rutina.includes(item)}
                  onChange={() => seleccionarMultiple("rutina", item)}
                />
                {item}
              </label>
            ))}
          </div>
          <button
            className="btn-next"
            onClick={() => setPaso(5)}
            disabled={loading}
          >
            Continuar
          </button>
        </div>
      )}

      {/* ================= PASO 5 ================= */}
      {paso === 5 && (
        <div className="quiz-step">
          <h2>5. Productos que utilizas</h2>
          <div className="opciones checkbox-list">
            {[
              "Shampoo",
              "Acondicionador",
              "Mascarilla",
              "Cremas de peinar",
              "Gel o mousse",
              "Aceites o serums",
              "Ninguno",
            ].map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={respuestas.productos.includes(item)}
                  onChange={() => seleccionarMultiple("productos", item)}
                />
                {item}
              </label>
            ))}
          </div>
          <button
            className="btn-next"
            onClick={() => setPaso(6)}
            disabled={loading}
          >
            Continuar
          </button>
        </div>
      )}

      {/* ================= PASO 6 ================= */}
      {paso === 6 && (
        <div className="quiz-step">
          <h2>6. ¿Cuál es tu objetivo principal?</h2>
          <div className="opciones">
            {[
              "Definir ondas o rizos",
              "Reducir frizz",
              "Recuperar hidratación",
              "Más volumen",
              "Aprender a estilizar",
              "Transición capilar",
              "Otros",
            ].map((item) => (
              <button
                key={item}
                onClick={() => seleccionar("objetivo", item)}
                disabled={loading}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================= PASO 7 ================= */}
      {paso === 7 && (
        <div className="quiz-step">
          <h2>7. Adjuntar foto del cabello</h2>
          <p>
            Puedes subir hasta {MAX_FILES} fotos (JPG/PNG/WEBP, max 5MB c/u)
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            disabled={loading}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {(respuestas.fotos || []).map((f, i) => (
              <span key={i} style={{ fontSize: 12 }}>
                {f.name}
              </span>
            ))}
          </div>
          <button
            className="btn-next"
            onClick={() => setPaso(8)}
            disabled={loading}
          >
            Continuar
          </button>
        </div>
      )}

      {/* ================= PASO 8 ================= */}
      {paso === 8 && (
        <div className="quiz-step">
          <h2>8. Tus datos personales</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPaso(9);
            }}
          >
            <input
              type="text"
              placeholder="Nombre completo"
              required
              value={respuestas.nombre}
              onChange={(e) =>
                setRespuestas({ ...respuestas, nombre: e.target.value })
              }
              disabled={loading}
            />
            <input
              type="tel"
              placeholder="Teléfono"
              required
              value={respuestas.telefono}
              onChange={(e) =>
                setRespuestas({ ...respuestas, telefono: e.target.value })
              }
              disabled={loading}
            />
            <input
              type="email"
              placeholder="Correo"
              required
              value={respuestas.correo}
              onChange={(e) =>
                setRespuestas({ ...respuestas, correo: e.target.value })
              }
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              Continuar
            </button>
          </form>
        </div>
      )}

      {/* ================= PASO 9 ================= */}
      {paso === 9 && (
        <div className="quiz-step">
          <h2>9. Selecciona tu cita</h2>
          <div className="reserva-precios">
            <h3>Precios de los servicios</h3>

            <div className="precio-bloque">
              <h4>Definición de rizos</h4>
              <ul>
                <li>
                  Cabello corto: <strong>$50.000</strong>
                </li>
                <li>
                  Cabello medio: <strong>$60.000</strong>
                </li>
                <li>
                  Cabello largo: <strong>$70.000</strong>
                </li>
              </ul>
            </div>

            <div className="precio-bloque">
              <h4>Corte + definición</h4>
              <ul>
                <li>
                  Cabello corto: <strong>$65.000</strong>
                </li>
                <li>
                  Cabello medio: <strong>$75.000</strong>
                </li>
                <li>
                  Cabello largo: <strong>$85.000</strong>
                </li>
              </ul>
            </div>

            <div className="precio-bloque">
              <h4>Corte solo</h4>
              <ul>
                <li>
                  Cabello corto: <strong>$22.000</strong>
                </li>
                <li>
                  Cabello medio: <strong>$30.000</strong>
                </li>
                <li>
                  Cabello largo: <strong>$40.000</strong>
                </li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleReservaFinal}>
            <label>Día disponible (solo sábados)</label>
            <select
              required
              onChange={(e) => calcularHoras(e.target.value)}
              disabled={loading}
            >
              <option value="">Elige un sábado</option>
              {sabados.map((f, i) => (
                <option key={i} value={f.toISOString()}>
                  {f.toLocaleDateString("es-ES", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                  })}
                </option>
              ))}
            </select>
            <label>Hora disponible</label>
            <select
              required
              disabled={loading}
              value={respuestas.hora}
              onChange={(e) =>
                setRespuestas({ ...respuestas, hora: e.target.value })
              }
            >
              <option value="">
                {horasDisponibles.length === 0
                  ? "Selecciona primero un día"
                  : "Selecciona una hora"}
              </option>

              {horasDisponibles.map((hora, i) => (
                <option key={i} value={hora}>
                  {hora}
                </option>
              ))}
            </select>

            <button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Confirmar reserva"}
            </button>

            <p className="legal-text">
              Al confirmar tu reserva aceptas nuestra{" "}
              <Link to="/politica-privacidad">Política de Privacidad</Link>.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
