//src/components/Footer.jsx
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Footer() {
  const { totalItems } = useCart();

  return (
    <footer className="mobile-footer">
      <Link to="/carrito" className="cart-centered">
        <div className="cart-icon">
          🛒
          {totalItems > 0 && (
            <span className="cart-count">{totalItems}</span>
          )}
        </div>
        <span className="cart-text">Carrito</span>
      </Link>
    </footer>
  );
}