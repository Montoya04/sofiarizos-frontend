import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles/Header.css";
import logo from "../assets/LOGO SOFI RIZOS-05.png";

export default function Header({ carrito = [], nuevoItem, setNuevoItem }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "header-scrolled" : ""}`}>
      <Link to="/" className="logo-link">
        <img src={logo} alt="SofiaRizos" className="logo" />
      </Link>

      <nav className="nav">
        <Link to="/">Servicios</Link>
        <Link to="/cursos">Cursos</Link>
        <Link to="/reserva">Reserva</Link>

        {/* 🛒 Carrito */}
        <Link
          to="/carrito"
          className="cart-icon"
          onClick={() => setNuevoItem(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5" />
          </svg>

          {/* 🔴 Aviso tipo WhatsApp */}
          {nuevoItem && <span className="cart-dot"></span>}

          {/* 🔢 Contador */}
          {carrito.length > 0 && (
            <span className="cart-counter">{carrito.length}</span>
          )}
        </Link>
      </nav>
    </header>
  );
}
