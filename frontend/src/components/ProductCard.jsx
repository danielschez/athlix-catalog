// src/components/ProductCard.jsx
import { useState } from "react";
import { useCart } from "../context/CartContext";

const BASE_URL = import.meta.env.VITE_API_URL;

function resolverImagen(url) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BASE_URL}${url}`;
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [imgIndex, setImgIndex] = useState(0);

  const imagenes = [
    resolverImagen(product.imagen1),
    resolverImagen(product.imagen2),
    resolverImagen(product.imagen3),
  ].filter(Boolean);

  if (imagenes.length === 0) {
    imagenes.push("https://placehold.co/400x400?text=Sin+imagen");
  }

  const nombre = product.nombre || product.name || "Producto";
  const precio = product.precio || product.price || 0;
  const tallas = product.tallas || [];

  const prev = (e) => {
    e.stopPropagation();
    setImgIndex((i) => (i - 1 + imagenes.length) % imagenes.length);
  };

  const next = (e) => {
    e.stopPropagation();
    setImgIndex((i) => (i + 1) % imagenes.length);
  };

  return (
    <article className="product-card">

      {/* CARRUSEL */}
      <div className="image-wrapper">
        <img src={imagenes[imgIndex]} alt={`${nombre} ${imgIndex + 1}`} />

        {/* Flechas — solo si hay más de una imagen */}
        {imagenes.length > 1 && (
          <>
            <button className="carousel-btn carousel-btn--prev" onClick={prev}>
              ‹
            </button>
            <button className="carousel-btn carousel-btn--next" onClick={next}>
              ›
            </button>

            {/* Dots */}
            <div className="carousel-dots">
              {imagenes.map((_, i) => (
                <button
                  key={i}
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

        {tallas.length > 0 && (
          <div className="product-sizes">
            {tallas.slice(0, 4).map((t) => (
              <span key={t} className="size-badge">{t}</span>
            ))}
            {tallas.length > 4 && (
              <span className="size-badge">+{tallas.length - 4}</span>
            )}
          </div>
        )}

        <p className="product-price">
          ${Number(precio).toLocaleString("es-MX")}
        </p>

        <button
          className="add-to-cart-btn"
          onClick={() => addToCart({
            id:     product.id,
            nombre: nombre,
            precio: Number(precio),
            imagen: imagenes[0],
          })}
        >
          🛒 Añadir al carrito
        </button>
      </div>
    </article>
  );
}