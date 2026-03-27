// src/pages/Gorras.jsx
import { useState, useMemo } from "react";
import Header from "../components/Header";
import Filters from "../components/Filters";
import ProductGrid from "../components/ProductGrid";
import { useProductos } from "../hooks/useProductos";

const CATEGORIA_GORRAS_ID = 14;

export default function Gorras() {
  const { productos, categorias, loading, error } = useProductos(CATEGORIA_GORRAS_ID);
  const [selected, setSelected] = useState([]);

  const subcategorias = useMemo(
    () => categorias
      .filter((c) => c.padre === CATEGORIA_GORRAS_ID)
      .map((c) => c.nombre),
    [categorias]
  );

  const categoriaMap = useMemo(() => {
    const map = {};
    categorias.forEach((c) => { map[c.nombre] = c.id; });
    return map;
  }, [categorias]);

  const gorrasFilters = useMemo(() => [
    ...(subcategorias.length > 0 ? [{
      title: "Categoría",
      type: "checkbox",
      options: subcategorias,
    }] : []),
    {
      title: "Precio",
      type: "checkbox",
      options: ["Menos de $500", "$500 - $1,000", "Más de $1,000"],
    },
  ], [subcategorias]);

  const productosFiltrados = useMemo(() => {
    if (selected.length === 0) return productos;

    const categoriasSeleccionadas = selected.filter((s) => subcategorias.includes(s));
    const preciosSeleccionados    = selected.filter((s) => !subcategorias.includes(s));

    return productos.filter((p) => {
      const categoriaOk = categoriasSeleccionadas.length === 0
        || categoriasSeleccionadas.some((nombre) => categoriaMap[nombre] === p.categoria);

      const precio = Number(p.precio);
      const precioOk = preciosSeleccionados.length === 0
        || preciosSeleccionados.some((f) => {
          if (f === "Menos de $500")  return precio < 500;
          if (f === "$500 - $1,000")  return precio >= 500 && precio <= 1000;
          if (f === "Más de $1,000")  return precio > 1000;
          return false;
        });

      return categoriaOk && precioOk;
    });
  }, [productos, selected, subcategorias, categoriaMap]);

  return (
    <>
      <Header />
      <main className="container layout">
        <Filters config={gorrasFilters} onFilterChange={setSelected} />
        <section style={{ flex: 1 }}>
          <div className="listing-header">
            <h2>Gorras ({productosFiltrados.length})</h2>
          </div>
          {error && <p className="auth-error">{error}</p>}
          <ProductGrid products={productosFiltrados} loading={loading} />
        </section>
      </main>
    </>
  );
}