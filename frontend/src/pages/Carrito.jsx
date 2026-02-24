import Header from "../components/Header";
import { useCart } from "../context/CartContext";

export default function Carrito() {
  const { cart, removeFromCart, totalPrice, clearCart } = useCart();

  return (
    <>
      <Header />
      <main className="container" style={{ paddingTop: "40px" }}>
        <h1>Tu Carrito</h1>

        {cart.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <h3>{item.name}</h3>
                <p>Cantidad: {item.quantity}</p>
                <p>${item.price}</p>
                <button onClick={() => removeFromCart(item.id)}>
                  Eliminar
                </button>
              </div>
            ))}

            <h2>Total: ${totalPrice}</h2>

            <button onClick={clearCart}>Vaciar carrito</button>
          </>
        )}
      </main>
    </>
  );
}