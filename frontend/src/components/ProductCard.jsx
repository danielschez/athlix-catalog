/* src/components/ProductCard.jsx */
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="product-card">
      <div className="image-wrapper">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-info">
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">Calzado para Hombre</p>
        <p className="product-price">${product.price}</p>

        <button
          className="add-to-cart-btn"
          onClick={() => addToCart(product)}
        >
          🛒 Añadir al carrito
        </button>
      </div>
    </article>
  );
}