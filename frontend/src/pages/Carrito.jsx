// src/pages/Carrito.jsx
import Header from "../components/Header";
import { useCart } from "../context/CartContext";

export default function Carrito() {
  const { cart, removeFromCart, totalPrice, clearCart } = useCart();

  return (
    <>
      <Header />
      <main className="cart-container">
        <h1>Tu Carrito</h1>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Tu carrito está vacío.</p>
          </div>
        ) : (
          <div className="cart-grid">
            {/* Productos */}
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-price">${item.price}</p>
                    <p className="cart-item-qty">Cantidad: {item.quantity}</p>
                    <button
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <aside className="cart-summary">
              <h2>Resumen</h2>
              <p>Total: <strong>${totalPrice}</strong></p>
              <button className="checkout-btn">Ir a pagar</button>
              <button className="clear-cart-btn" onClick={clearCart}>
                Vaciar carrito
              </button>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}