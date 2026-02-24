import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-neutral-800">
      <div className="container header">
        <Link to="/">
          <img src="/logo.avif" alt="Grillo logo" className="logo" />
        </Link>

        <button
          className="menu-btn"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          ☰
        </button>

        <nav className={`nav ${open ? "open" : ""}`}>
          <Link to="/calzado">Calzado</Link>
          <Link to="/ropa">Ropa</Link>
          <Link to="/accesorios">Accesorios</Link>
        </nav>
      </div>
    </header>
  );
}
