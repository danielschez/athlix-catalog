/* src/components/ProductGrid.jsx */
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, loading = false }) {
  if (loading) {
    return (
      <section className="grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="product-card-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
            <div className="skeleton-text shorter"></div>
          </div>
        ))}
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <h3>No se encontraron productos</h3>
        <p>Intenta ajustar tus filtros para ver más resultados</p>
      </div>
    );
  }

  return (
    <section className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </section>
  );
}