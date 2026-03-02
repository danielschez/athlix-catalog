// src/pages/About.jsx
import Header from "../components/Header";

export default function About() {
  return (
    <>
      <Header />

      <main className="container">
        <div className="listing-header">
          <div className="listing-title">
            <h2>Sobre Grillo Shop</h2>
          </div>
        </div>

        <p>
          Grillo Shop es una tienda dedicada a ofrecer productos deportivos,
          gorras, uniformes y servicios de barbería con estilo urbano.
        </p>
      </main>
    </>
  );
}