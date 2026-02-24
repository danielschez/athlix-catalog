//components/Header.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

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
          <Link to="/carrito" className="cart-link">
            🛒 {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
