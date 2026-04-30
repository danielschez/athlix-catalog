// src/pages/Barberia.jsx
import Header from "../components/Header";

const servicios = [
  { nombre: "Corte de cabello",            precio: "$150" },
  { nombre: "Corte + Ceja + Mascarilla",   precio: "$200" },
  { nombre: "Corte + Barba + Ceja + Mascarilla", precio: "$300" },
  { nombre: "Ceja",                        precio: "$20"  },
  { nombre: "Barba",                       precio: "$100" },
  { nombre: "Mascarilla facial",           precio: "$50"  },
];

const membresias = [
  {
    nombre: "Membresía Grillo",
    precio: "$600",
    tag: "Popular",
    beneficios: [
      "Cortes ilimitados en el mes",
      "Ceja incluida",
      "Mascarilla (1 por semana)",
      "Peinado incluido",
      "Prioridad en citas",
    ],
  },
  {
    nombre: "Membresía Grillo Barbón",
    precio: "$800",
    tag: "Premium",
    beneficios: [
      "Cortes ilimitados en el mes",
      "Barba + ceja incluidas",
      "Mascarilla (1 por semana)",
      "Peinado incluido",
      "Prioridad en citas",
    ],
  },
];

export default function Barberia() {
  return (
    <>
      <Header />
      <main className="barberia-page">

        {/* HERO */}
        <section className="barberia-hero">
          <div className="container barberia-hero-content">
            <span className="about-eyebrow">Grillo Shop presenta</span>
            <h1 className="barberia-hero-title">Grillo <em>Cuts</em></h1>
            <p className="barberia-hero-sub">
              No solo un corte — una experiencia completa de estilo, imagen y confianza.
            </p>
            <div className="barberia-horario">
              <span>🕐</span>
              <div>
                <strong>Lunes a Sábado</strong>
                <span>1:00 pm — 8:00 pm</span>
              </div>
            </div>
          </div>
        </section>

        {/* DESCRIPCIÓN */}
        <section className="barberia-desc container">
          <p>
            Grillo Cuts es nuestra barbería dentro de Grillo Shop, creada para quienes
            buscan no solo un buen corte, sino una experiencia completa. Contamos con
            atención profesional, técnica y detalle en cada servicio — cortes modernos,
            fades, perfilado de barba y estilos personalizados.
          </p>
          <p>
            Nuestro barbero principal, con experiencia y estilo internacional, aporta
            un enfoque fresco, preciso y de alto nivel, haciendo de cada visita algo
            diferente y de calidad.
          </p>
        </section>

        {/* SERVICIOS */}
        <section className="barberia-section container">
          <h2 className="barberia-section-title">Servicios</h2>
          <div className="barberia-servicios">
            {servicios.map((s) => (
              <div key={s.nombre} className="barberia-servicio">
                <span className="barberia-servicio-nombre">{s.nombre}</span>
                <span className="barberia-servicio-precio">{s.precio}</span>
              </div>
            ))}
          </div>
        </section>

        {/* MEMBRESÍAS */}
        <section className="barberia-section container">
          <h2 className="barberia-section-title">Membresías Mensuales</h2>
          <div className="barberia-membresias">
            {membresias.map((m) => (
              <div key={m.nombre} className="barberia-membresia">
                <div className="barberia-membresia-header">
                  <span className="barberia-membresia-tag">{m.tag}</span>
                  <h3>{m.nombre}</h3>
                  <span className="barberia-membresia-precio">{m.precio}<small>/mes</small></span>
                </div>
                <ul className="barberia-membresia-list">
                  {m.beneficios.map((b) => (
                    <li key={b}>
                      <span className="barberia-check">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="barberia-cta container">
          <p>¿Listo para el cambio?</p>
          <h2>Visítanos en Plaza Mariana, Local 8</h2>
          <span>Acceso a Candiles, Querétaro</span>
        </section>

      </main>
    </>
  );
}