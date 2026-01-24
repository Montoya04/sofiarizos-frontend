import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Servicios from "./pages/Servicios";
import Cursos from "./pages/Cursos";
import Reserva from "./pages/Reserva";
import Carrito from "./pages/Carrito";
import ReservaAdmin from "./pages/ReservaAdmin";
import AdminLogin from "./pages/AdminLogin";
import AdminGuard from "./components/AdminGuard";

export default function App() {
  // 🛒 Carrito global
  const [carrito, setCarrito] = useState([]);

  // 🔔 Aviso visual tipo WhatsApp
  const [nuevoItem, setNuevoItem] = useState(false);

  return (
    <BrowserRouter>
      {/* HEADER */}
      <Header
        carrito={carrito}
        nuevoItem={nuevoItem}
        setNuevoItem={setNuevoItem}
      />

      <Routes>
        <Route path="/" element={<Servicios />} />

        <Route
          path="/cursos"
          element={
            <Cursos
              carrito={carrito}
              setCarrito={setCarrito}
              setNuevoItem={setNuevoItem}
            />
          }
        />

        <Route
          path="/carrito"
          element={<Carrito carrito={carrito} setNuevoItem={setNuevoItem} />}
        />

        <Route path="/reserva" element={<Reserva />} />

        {/* LOGIN ADMIN */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* PANEL ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <ReservaAdmin />
            </AdminGuard>
          }
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
