// src/pages/Carrito.jsx
import { useState } from "react";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";

export default function Carrito() {
  const { cart, removeFromCart, totalPrice, clearCart } = useCart();
  const [pedidoEnviado, setPedidoEnviado] = useState(false);

  const handleSolicitarPedido = () => {
    setPedidoEnviado(true);
    clearCart();
  };

  return (
    <>
      <Header />
      <main className="cart-container">
        <h1 style={{ color: "#fff" }}>Mí Carrito</h1>

        {pedidoEnviado ? (
          <div className="pedido-confirmado">
            <div className="pedido-icon">✅</div>
            <h2>¡Pedido enviado!</h2>
            <p>Tu pedido fue recibido. Nos pondremos en contacto contigo pronto para coordinar la entrega.</p>
            <button className="checkout-btn" onClick={() => setPedidoEnviado(false)}>
              Seguir comprando
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="empty-cart">
            <p>Tu carrito está vacío.</p>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-price">${item.price}</p>
                    <p className="cart-item-qty">Cantidad: {item.quantity}</p>
                    <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="cart-summary">
              <h2>Resumen</h2>
              <p>Total: <strong>${totalPrice}</strong></p>
              <button className="checkout-btn" onClick={handleSolicitarPedido}>
                📦 Solicitar Pedido
              </button>
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