// src/pages/Carrito.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Carrito() {
  const { cart, removeFromCart, totalPrice, clearCart, itemKey } = useCart();
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const API_URL    = import.meta.env.VITE_API_URL;

  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");
  const [erroresStock, setErroresStock]   = useState([]);

  const handleSolicitarPedido = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");
    setErroresStock([]);

    try {
      const res = await fetch(`${API_URL}/api/pedidos/crear/`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: user.id,
          items: cart.map((item) => ({
            id:       item.id,
            quantity: item.quantity,
            talla_id: item.talla_id || null,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Error al crear el pedido.");
        return;
      }

      if (data.errores && data.errores.length > 0) {
        setErroresStock(data.errores);

        if (parseFloat(data.total) === 0) {
          setError("No se pudo procesar ningún producto. Verifica la disponibilidad.");
          return;
        }

        clearCart();
        setPedidoEnviado(true);
        return;
      }

      clearCart();
      setPedidoEnviado(true);

    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
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

            {/* Muestra advertencias de stock si algunos productos fallaron */}
            {erroresStock.length > 0 && (
              <div style={{ marginTop: "16px", textAlign: "left", maxWidth: "400px" }}>
                <p style={{ color: "#f0c14b", fontWeight: 600, marginBottom: "8px" }}>
                  ⚠️ Algunos productos tuvieron cambios:
                </p>
                {erroresStock.map((err, i) => (
                  <p key={i} style={{ color: "#ff6b6b", fontSize: "14px", margin: "4px 0" }}>
                    • {err}
                  </p>
                ))}
              </div>
            )}

            <button className="checkout-btn" onClick={() => {
              setPedidoEnviado(false);
              setErroresStock([]);
            }}>
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
                const key    = itemKey(item);

                return (
                  <div key={key} className="cart-item-card">
                    <img src={imagen} alt={nombre} />
                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{nombre}</h3>
                      {item.talla && (
                        <p className="cart-item-talla">Talla: {item.talla}</p>
                      )}
                      <p className="cart-item-price">
                        ${Number(precio).toLocaleString("es-MX")}
                      </p>
                      <p className="cart-item-qty">Cantidad: {item.quantity}</p>
                      <p className="cart-item-subtotal">
                        Subtotal: ${Number(precio * item.quantity).toLocaleString("es-MX")}
                      </p>
                      <button className="cart-remove-btn" onClick={() => removeFromCart(key)}>
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

              {/* Errores de stock en tiempo real */}
              {erroresStock.length > 0 && (
                <div>
                  <p style={{ color: "#f0c14b", fontSize: "13px", fontWeight: 600, margin: "0 0 6px" }}>
                    ⚠️ Problemas de disponibilidad:
                  </p>
                  {erroresStock.map((err, i) => (
                    <p key={i} className="auth-error" style={{ fontSize: "13px", margin: "4px 0" }}>
                      {err}
                    </p>
                  ))}
                </div>
              )}

              {error && <p className="auth-error">{error}</p>}

              {!user && (
                <p className="auth-error">Inicia sesión para solicitar tu pedido.</p>
              )}

              <button
                className="checkout-btn"
                onClick={handleSolicitarPedido}
                disabled={loading}
              >
                {loading ? "Enviando..." : "📦 Solicitar Pedido"}
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