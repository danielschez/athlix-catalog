// src/pages/Ropa.jsx
import { useState, useMemo } from "react";
import Header from "../components/Header";
import Filters from "../components/Filters";
import ProductGrid from "../components/ProductGrid";
import Seo from "../components/Seo";
import { useProductos } from "../hooks/useProductos";

const CATEGORIA_ROPA_ID = 2;

export default function Ropa() {
  const { productos, tallas, loading, error } = useProductos(CATEGORIA_ROPA_ID);
  const [selected, setSelected] = useState([]);

  const tallasRopa = useMemo(
    () => tallas.filter((t) => t.tipo === "ropa"),
    [tallas]
  );

  const tallaMap = useMemo(() => {
    const map = {};
    tallasRopa.forEach((t) => { map[t.id] = t.talla; });
    return map;
  }, [tallasRopa]);

  const ropaFilters = useMemo(() => [
    {
      title: "Categoría",
      type: "checkbox",
      options: ["Hombre", "Mujer", "Playeras", "Sudaderas & Chamarras", "Conjuntos", "Shorts"],
    },
    {
      title: "Tallas",
      type: "buttons",
      options: tallasRopa.map((t) => t.talla),
    },
  ], [tallasRopa]);

  const productosFiltrados = useMemo(() => {
    if (selected.length === 0) return productos;
    return productos.filter((p) =>
      p.tallas?.some((id) => selected.includes(tallaMap[id]))
    );
  }, [productos, selected, tallaMap]);

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