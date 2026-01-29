import "./styles/Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h2 className="footer-logo">Sofi</h2>

        <p className="footer-email">
          <a href="/politica-privacidad">Política de Privacidad</a>
        </p>

        {/* POLÍTICA */}
        <p className="footer-legal">
          <Link to="/politica-privacidad">Política de Privacidad</Link>
        </p>

        {/* Correo */}
        <p className="footer-email">
          <a href="mailto:soficmrizos@gmail.com">soficmrizos@gmail.com</a>
        </p>

        {/* REDES */}
        <div className="footer-social">
          <a
            href="https://www.instagram.com/sofiaacorream?igsh=NDNuY3l4YnNzaDE2"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <svg viewBox="0 0 24 24">
              <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3.5A5.5 5.5 0 1 0 17.5 13 5.51 5.51 0 0 0 12 7.5zm0 2A3.5 3.5 0 1 1 8.5 13 3.5 3.5 0 0 1 12 9.5zm4.75-3.75a1.25 1.25 0 1 0 1.25 1.25 1.26 1.26 0 0 0-1.25-1.25z" />
            </svg>
          </a>

          <a
            href="https://wa.me/573195951926"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 2A10 10 0 0 0 2 12a9.93 9.93 0 0 0 1.46 5.25L2 22l4.92-1.43A10 10 0 1 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
            </svg>
          </a>

          <a
            href="https://www.tiktok.com/@sofiacorream?_r=1&_t=ZS-91Z0gtdGuZe"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <svg viewBox="0 0 24 24">
              <path d="M21 8.5a6.5 6.5 0 0 1-4-1.4V17a5 5 0 1 1-5-5v3a2 2 0 1 0 2 2V2h3a6.5 6.5 0 0 0 4 6.5z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
