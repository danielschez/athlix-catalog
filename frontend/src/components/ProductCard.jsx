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
        <h3>{product.name}</h3>
        <p className="category">Calzado para Hombre</p>
        <p className="price">${product.price}</p>

        <button
          className="add-cart"
          onClick={() => addToCart(product)}
        >
          Añadir al carrito
        </button>
      </div>
    </article>
  );
}
