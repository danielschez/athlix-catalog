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
        <Link to="/" className="logo-container">
          <img src="/logo.avif" alt="Grillo logo" className="logo" />
          <span className="logo-text">Grillo Shop</span>
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
          <Link to="/gorras">Gorras</Link>
          <Link to="/uniformes">Uniformes</Link>
          <Link to="/accesorios">Accesorios</Link>
          <Link to="/about">Sobre Grillo Shop</Link>
          <Link to="/barberia">Barbería - Grillo Cuts</Link>
          <Link to="/carrito" className="cart-link desktop-only">
            <span className="cart-icon">🛒</span>
            <span className="cart-text">Carrito</span>
            {totalItems > 0 && (
              <span className="cart-count">{totalItems}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
