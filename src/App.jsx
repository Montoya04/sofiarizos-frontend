import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import Header from "./components/Header";
import Footer from "./components/Footer";

// Páginas públicas
import Servicios from "./pages/Servicios";
import Cursos from "./pages/Cursos";
import Reserva from "./pages/Reserva";
import Carrito from "./pages/Carrito";

// Admin
import AdminLogin from "./pages/AdminLogin";
import ReservaAdmin from "./pages/ReservaAdmin";
import AdminGuard from "./components/AdminGuard";

// Layout público (con header y footer)
function PublicLayout() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Servicios />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/reserva" element={<Reserva />} />
        <Route path="/carrito" element={<Carrito />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN ADMIN (SIN HEADER NI FOOTER) */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* PANEL ADMIN PROTEGIDO */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <ReservaAdmin />
            </AdminGuard>
          }
        />

        {/* SITIO PÚBLICO */}
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
