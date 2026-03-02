// src/pages/Barberia.jsx
import Header from "../components/Header";

export default function Barberia() {
  return (
    <>
      <Header />

      <main className="container">
        <div className="listing-header">
          <div className="listing-title">
            <h2>Barbería - Grillo Cuts</h2>
            <p>Reserva tu cita con nosotros</p>
          </div>
        </div>

        <div className="barberia-content">
          <p>
            Próximamente podrás reservar tu cita en línea.
          </p>
        </div>
      </main>
    </>
  );
}