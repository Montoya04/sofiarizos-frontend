import "./styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h2 className="footer-logo">Sofi</h2>

        <p className="footer-text">
          © 2025 SofiaRizos — Todos los derechos reservados.
        </p>

        {/* Correo */}
        <p className="footer-email">
          <a href="mailto:soficmrizos@gmail.com">soficmrizos@gmail.com</a>
        </p>

        <div className="footer-social">
          <a
            href="https://www.instagram.com/sofiaacorream?igsh=NDNuY3l4YnNzaDE2
"
            target="_blank"
            className="social-icon"
          >
            <svg viewBox="0 0 24 24">
              <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3.5A5.5 5.5 0 1 0 17.5 13 5.51 5.51 0 0 0 12 7.5zm0 2A3.5 3.5 0 1 1 8.5 13 3.5 3.5 0 0 1 12 9.5zm4.75-3.75a1.25 1.25 0 1 0 1.25 1.25 1.26 1.26 0 0 0-1.25-1.25z" />
            </svg>
          </a>

          <a
            href="https://wa.me/573195951926"
            target="_blank"
            className="social-icon"
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 2A10 10 0 0 0 2 12a9.93 9.93 0 0 0 1.46 5.25L2 22l4.92-1.43A10 10 0 1 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm4.25-5.19c-.23-.11-1.39-.68-1.61-.76s-.37-.11-.52.11-.6.76-.74.91-.27.17-.5.06a6.63 6.63 0 0 1-3.31-2.9c-.25-.43.25-.4.71-1.33a.44.44 0 0 0 0-.42c-.06-.11-.52-1.25-.71-1.71s-.38-.39-.52-.39h-.45a.86.86 0 0 0-.62.29A2.61 2.61 0 0 0 7 11.12a4.55 4.55 0 0 0 .93 2.39A10.43 10.43 0 0 0 12 16.5a4.9 4.9 0 0 0 2.42.63c.58 0 1.39-.16 1.59-.63s.2-1.16.14-1.26-.2-.11-.39-.2z" />
            </svg>
          </a>

          <a
            href="https://www.tiktok.com/@sofiacorream?_r=1&_t=ZS-91Z0gtdGuZe
"
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
