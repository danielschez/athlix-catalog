import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-neutral-800">
      <div className="container header">
        <img src="/logo.avif" alt="Grillo logo" className="logo" />

        {/* Botón hamburguesa (solo móvil) */}
        <button
          className="menu-btn"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          ☰
        </button>

        {/* Navegación */}
        <nav className={`nav ${open ? "open" : ""}`}>
          <a href="#">Calzado</a>
          <a href="#">Ropa</a>
          <a href="#">Otros</a>
        </nav>
      </div>
    </header>
  );
}
