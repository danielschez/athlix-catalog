// src/pages/About.jsx
import Header from "../components/Header";

export default function About() {
  return (
    <>
      <Header />
      <main className="about-page">

        {/* HERO */}
        <section className="about-hero">
          <div className="about-hero-bg" />
          <div className="container about-hero-content">
            <span className="about-eyebrow">Fundada en Querétaro</span>
            <h1 className="about-hero-title">
              Más de <em>10 años</em><br />construyendo confianza
            </h1>
            <p className="about-hero-sub">
              Hola, soy Grillo — fundador de Grillo Shop.
            </p>
          </div>
        </section>

        {/* STATS */}
        <section className="about-stats">
          <div className="container about-stats-grid">
            {[
              { num: "50,000+", label: "Clientes en México" },
              { num: "10+",     label: "Años de experiencia" },
              { num: "32",      label: "Estados con envíos" },
              { num: "100%",    label: "Productos verificados" },
            ].map((s) => (
              <div key={s.label} className="about-stat">
                <span className="about-stat-num">{s.num}</span>
                <span className="about-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* HISTORIA */}
        <section className="about-section container">
          <div className="about-text-block">
            <span className="about-tag">Nuestra historia</span>
            <p>
              Desde hace más de 10 años me dedico a la venta de sneakers, ropa y
              productos exclusivos, construyendo día con día un negocio basado en
              confianza, calidad y atención real para cada cliente.
            </p>
            <p>
              Trabajamos mayoreo y menudeo, ofreciendo desde pares individuales
              hasta pedidos grandes para clientes mayoristas dentro y fuera del
              país, siempre con atención personalizada y seguimiento en cada compra.
            </p>
            <p>
              Actualmente nos encontramos en <strong>Plaza Mariana, local 8,
              Acceso a Candiles, Querétaro</strong>, desde donde salen pares
              diariamente hacia toda la República Mexicana y envíos internacionales.
            </p>
          </div>

          <div className="about-quote-block">
            <blockquote>
              "La confianza no se promete, se demuestra — y por eso cada envío,
              cada venta y cada cliente hablan por nosotros."
            </blockquote>
            <cite>— Grillo, Fundador</cite>
          </div>
        </section>

        {/* MISIÓN Y VISIÓN */}
        <section className="about-mv container">
          <div className="about-mv-card">
            <span className="about-mv-icon">🎯</span>
            <h3>Misión</h3>
            <p>
              Brindar sneakers, ropa y productos exclusivos con la mejor calidad,
              ofreciendo confianza, atención personalizada y una experiencia de
              compra segura tanto en menudeo como en mayoreo — siempre buscando
              que cada cliente encuentre estilo, exclusividad y excelente precio.
            </p>
          </div>
          <div className="about-mv-card">
            <span className="about-mv-icon">🚀</span>
            <h3>Visión</h3>
            <p>
              Ser una de las tiendas de sneakers y streetwear más reconocidas de
              México, destacando por nuestra calidad, confianza y servicio — con
              alcance nacional e internacional y consolidándonos como referencia
              para quienes buscan los mejores pares.
            </p>
          </div>
        </section>

        {/* UBICACIÓN */}
        <section className="about-location container">
          <div className="about-location-inner">
            <span className="about-tag">Encuéntranos</span>
            <h2>Plaza Mariana, Local 8</h2>
            <p>Acceso a Candiles, Querétaro, México</p>
            <p className="about-location-detail">
              📦 Envíos diarios a toda la República Mexicana<br />
              🌎 Envíos internacionales para clientes mayoristas
            </p>
          </div>
        </section>

      </main>
    </>
  );
}