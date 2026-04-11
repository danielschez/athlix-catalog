// src/components/ProductCard.jsx
import { useState, useCallback } from "react";
import { useCart } from "../context/CartContext";

const BASE_URL = import.meta.env.VITE_API_URL;

function resolverImagen(url) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BASE_URL}${url}`;
}

export default function ProductCard({ product }) {
  const { addToCart, cart } = useCart();

  const [imgIndex, setImgIndex]             = useState(0);
  const [error, setError]                   = useState("");
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);

  const imagenes = [
    resolverImagen(product.imagen1),
    resolverImagen(product.imagen2),
    resolverImagen(product.imagen3),
  ].filter(Boolean);

  if (imagenes.length === 0) {
    imagenes.push("https://placehold.co/400x400?text=Sin+imagen");
  }

  const nombre      = product.nombre || product.name || "Producto";
  const precio      = product.precio || product.price || 0;
  const tallas      = Array.isArray(product.tallas) ? product.tallas : [];
  const tieneTallas = tallas.length > 0;

  const prev = (e) => {
    e.stopPropagation();
    setImgIndex((i) => (i - 1 + imagenes.length) % imagenes.length);
  };

  const next = (e) => {
    e.stopPropagation();
    setImgIndex((i) => (i + 1) % imagenes.length);
  };

  const seleccionarTalla = useCallback((talla) => {
    if (talla.stock <= 0) return;
    setTallaSeleccionada(talla);
    setError("");
  }, []);

  const handleAgregarAlCarrito = () => {
    setError("");

    if (tieneTallas && !tallaSeleccionada) {
      setError("Selecciona una talla.");
      return;
    }

    const stockDisponible = tieneTallas
      ? tallaSeleccionada.stock
      : Number(product.stock || product.stock_total || 0);

    const itemEnCarrito = cart.find((item) =>
      item.id === product.id &&
      (item.talla_id || null) === (tallaSeleccionada?.id || null)
    );
    const cantidadEnCarrito = itemEnCarrito?.quantity || 0;

    if (cantidadEnCarrito >= stockDisponible) {
      setError(
        stockDisponible === 0
          ? "Lo sentimos, este producto está agotado."
          : `Lo sentimos, solo hay ${stockDisponible} disponible${stockDisponible !== 1 ? "s" : ""}.`
      );
      return;
    }

    addToCart({
      id:       product.id,
      nombre,
      precio:   Number(precio),
      imagen:   imagenes[0],
      talla_id: tallaSeleccionada?.id          || null,
      talla:    tallaSeleccionada?.talla_nombre || null,
    });

    setTallaSeleccionada(null);
    setError("");
  };

  return (
    <article className="product-card">
      <div className="image-wrapper">
        <img src={imagenes[imgIndex]} alt={`${nombre} ${imgIndex + 1}`} />

        {imagenes.length > 1 && (
          <>
            <button type="button" className="carousel-btn carousel-btn--prev" onClick={prev}>‹</button>
            <button type="button" className="carousel-btn carousel-btn--next" onClick={next}>›</button>
            <div className="carousel-dots">
              {imagenes.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`carousel-dot ${i === imgIndex ? "active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setImgIndex(i); }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="product-info">
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <h3 className="product-name">{nombre}</h3>

        {tieneTallas && (
          <div className="product-sizes">
            {tallas.map((talla) => (
              <button
                key={talla.id}
                type="button"
                className={`size-badge ${tallaSeleccionada?.id === talla.id ? "active" : ""} ${talla.stock === 0 ? "agotada" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  seleccionarTalla(talla);
                }}
                disabled={talla.stock === 0}
                title={talla.stock === 0 ? "Agotado" : `${talla.stock} disponibles`}
              >
                {talla.talla_nombre}
              </button>
            ))}
          </div>
        )}

        <p className="product-price">
          ${Number(precio).toLocaleString("es-MX")}
        </p>

        {tallaSeleccionada && (
          <p className="stock-info">
            {tallaSeleccionada.stock} disponibles en talla {tallaSeleccionada.talla_nombre}
          </p>
        )}

        {error && <div className="product-error-message">{error}</div>}

        <button type="button" className="add-to-cart-btn" onClick={handleAgregarAlCarrito}>
          🛒 Añadir al carrito
        </button>
      </div>
    </article>
  );
}