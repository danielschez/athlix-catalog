// src/pages/Ropa.jsx
import { useState, useMemo } from "react";
import Header from "../components/Header";
import Filters from "../components/Filters";
import ProductGrid from "../components/ProductGrid";
import Seo from "../components/Seo";
import { useProductos } from "../hooks/useProductos";

const CATEGORIA_ROPA_ID = 2; // ID de categoría para ropa, debe coincidir con el backend

export default function Ropa() {
  const { productos, tallas, loading, error } = useProductos(CATEGORIA_ROPA_ID);
  const [selected, setSelected] = useState([]);

  const ropaFilters = useMemo(() => [
    {
      title: "Categoría",
      type: "checkbox",
      options: ["Hombre", "Mujer", "Playeras", "Sudaderas & Chamarras", "Conjuntos", "Shorts"],
    },
    {
      title: "Tallas",
      type: "buttons",
      options: tallas
        .filter((t) => t.tipo === "ropa")
        .map((t) => t.talla),
    },
  ], [tallas]);

  const productosFiltrados = useMemo(() => {
    if (selected.length === 0) return productos;
    return productos.filter((p) =>
      p.tallas?.some((t) => selected.includes(t))
    );
  }, [productos, selected]);

  return (
    <>
      <Seo title="Ropa Deportiva | Tienda" description="Explora ropa deportiva." />
      <Header />
      <main className="container layout">
        <Filters config={ropaFilters} onFilterChange={setSelected} />
        <section style={{ flex: 1 }}>
          <div className="listing-header">
            <h2>Ropa ({productosFiltrados.length})</h2>
          </div>
          {error && <p className="auth-error">{error}</p>}
          <ProductGrid products={productosFiltrados} loading={loading} />
        </section>
      </main>
    </>
  );
}