import "./styles/Carrito.css";

export default function Carrito({ carrito = [] }) {
  // Número de WhatsApp
  const whatsappNumber = "573195951926";

  // Mensaje para WhatsApp
  const mensaje =
    carrito.length > 0
      ? "Hola, quiero inscribirme en los siguientes cursos:\n" +
        carrito.map((c, i) => `${i + 1}. ${c.nombre}`).join("\n")
      : "";

  return (
    <div className="carrito-container">
      <h2 className="carrito-title">Tu Carrito</h2>

      {carrito.length === 0 ? (
        <div className="carrito-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/102/102661.png"
            alt="Carrito vacío"
            className="carrito-img"
          />
          <p className="carrito-text">Aún no has agregado productos.</p>
          <a href="/cursos" className="carrito-btn">
            Ver Cursos
          </a>
        </div>
      ) : (
        <div className="carrito-card">
          <ul className="carrito-list">
            {carrito.map((c, i) => (
              <li key={i}>
                <strong>{c.nombre}</strong>
              </li>
            ))}
          </ul>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              mensaje
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="carrito-btn"
          >
            Pagar / Contactar vía WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
