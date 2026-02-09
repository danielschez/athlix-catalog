/* src/components/ProductCard.jsx */
export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="image-wrapper">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>

      <div className="product-info">
        {product.tag && (
          <div className="product-tags">
            <span className="tag">{product.tag}</span>
          </div>
        )}
        
        <h3>{product.name}</h3>
        <p className="category">{product.category}</p>
        <p className="color-count">{product.colors} colores</p>
        <p className="price">${product.price.toLocaleString('es-MX')}</p>
      </div>
    </article>
  );
}