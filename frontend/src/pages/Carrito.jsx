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
            <p>Tu pedido fue recibido. Nos pondremos en contacto contigo pronto.</p>
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
              {cart.map((item) => {
                const nombre = item.nombre || item.name  || "Producto";
                const precio = item.precio || item.price || 0;
                const imagen = item.imagen || item.image || "https://placehold.co/100x100?text=Sin+imagen";

                return (
                  <div key={item.id} className="cart-item-card">
                    <img src={imagen} alt={nombre} />
                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{nombre}</h3>
                      <p className="cart-item-price">
                        ${Number(precio).toLocaleString("es-MX")}
                      </p>
                      <p className="cart-item-qty">Cantidad: {item.quantity}</p>
                      <p className="cart-item-subtotal">
                        Subtotal: ${Number(precio * item.quantity).toLocaleString("es-MX")}
                      </p>
                      <button
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="cart-summary">
              <h2>Resumen</h2>
              <div className="summary-row">
                <span>Productos ({cart.reduce((a, i) => a + i.quantity, 0)})</span>
                <span>${Number(totalPrice).toLocaleString("es-MX")}</span>
              </div>
              <div className="summary-total">
                <strong>Total</strong>
                <strong>${Number(totalPrice).toLocaleString("es-MX")}</strong>
              </div>
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