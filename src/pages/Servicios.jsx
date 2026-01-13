import { useState, useEffect } from "react";
import ServiceCard from "../components/ServiceCard";
import "./styles/Servicios.css";

// Foto principal (se usará en el carrusel)
import fotoPrincipal from "../assets/PAGINA (2).png";

// Carrusel
import carrusel1 from "../assets/DEFINICIÓN ONDAS.png";
import carrusel2 from "../assets/Definición Rizos.png";
import carrusel3 from "../assets/DEFINICION AFRO.png";

// Servicios
import ondasImg from "../assets/Ondas.png";
import cresposImg from "../assets/Crespos.png";
import afrosImg from "../assets/afro.png";

export default function Servicios() {
  // Ahora la primera foto será la principal (foto de la clienta)
  const imagenes = [fotoPrincipal, carrusel1, carrusel2, carrusel3];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagenes.length);
    }, 3500);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="servicios-container">
      {/* CARRUSEL — ahora con la imagen de la clienta como principal */}
      <div className="carrusel">
        <img
          key={index}
          src={imagenes[index]}
          alt="carrusel"
          className="carrusel-img"
        />

        <div className="carrusel-indicadores">
          {imagenes.map((_, i) => (
            <div key={i} className={`dot ${index === i ? "activo" : ""}`}></div>
          ))}
        </div>
      </div>

      <h2 className="titulo">Nuestros Servicios</h2>

      {/* SERVICIOS */}
      <div className="servicios-grid">
        <ServiceCard
          title="Ondas"
          description="Realzamos la forma natural de tus ondas con técnicas especializadas que aportan definición, volumen y brillo sin perder suavidad."
          img={ondasImg}
        />

        <ServiceCard
          title="Crespos"
          description="Tratamientos diseñados para dar forma, control y elasticidad a tus crespos. Rizos más definidos, hidratados y con volumen equilibrado."
          img={cresposImg}
        />

        <ServiceCard
          title="Afros"
          description="Cuidado profesional para resaltar tu cabello afro: hidratación profunda, definición y protección para mantener su esencia natural."
          img={afrosImg}
        />
      </div>
    </div>
  );
}
