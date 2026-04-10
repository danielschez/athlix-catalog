// src/pages/Ropa.jsx
import { useState, useMemo } from "react";
import Header from "../components/Header";
import Filters from "../components/Filters";
import ProductGrid from "../components/ProductGrid";
import Seo from "../components/Seo";
import { useProductos } from "../hooks/useProductos";

const CATEGORIA_ROPA_ID = 2;

export default function Ropa() {
  const { productos, tallas, categorias, loading, error } = useProductos(CATEGORIA_ROPA_ID);
  const [selected, setSelected] = useState([]);

  const subcategorias = useMemo(
    () => categorias
      .filter((c) => c.padre === CATEGORIA_ROPA_ID)
      .map((c) => c.nombre),
    [categorias]
  );

  const tallasRopa = useMemo(
    () => tallas.filter((t) => t.tipo === "ropa"),
    [tallas]
  );

  const categoriaMap = useMemo(() => {
    const map = {};
    categorias.forEach((c) => { map[c.nombre] = c.id; });
    return map;
  }, [categorias]);

  const ropaFilters = useMemo(() => [
    {
      title: "Categoría",
      type: "checkbox",
      options: subcategorias,
    },
    {
      title: "Tallas",
      type: "buttons",
      options: tallasRopa.map((t) => t.talla),
    },
  ], [subcategorias, tallasRopa]);

  const productosFiltrados = useMemo(() => {
    if (selected.length === 0) return productos;

    const categoriasSeleccionadas = selected.filter((s) => subcategorias.includes(s));
    const tallasSeleccionadas     = selected.filter((s) => !subcategorias.includes(s));

    return productos.filter((p) => {
      const categoriaOk = categoriasSeleccionadas.length === 0
        || categoriasSeleccionadas.some((nombre) => categoriaMap[nombre] === p.categoria);

      // p.tallas ahora son objetos — compara por talla_nombre
      const tallaOk = tallasSeleccionadas.length === 0
        || p.tallas?.some((t) => tallasSeleccionadas.includes(t.talla_nombre));

      return categoriaOk && tallaOk;
    });
  }, [productos, selected, subcategorias, categoriaMap]);

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