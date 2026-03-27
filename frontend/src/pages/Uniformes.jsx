// src/pages/Uniformes.jsx
import { useState, useMemo } from "react";
import Header from "../components/Header";
import Filters from "../components/Filters";
import ProductGrid from "../components/ProductGrid";
import { useProductos } from "../hooks/useProductos";

const CATEGORIA_UNIFORMES_ID = 16;

export default function Uniformes() {
  const { productos, categorias, loading, error } = useProductos(CATEGORIA_UNIFORMES_ID);
  const [selected, setSelected] = useState([]);

  const subcategorias = useMemo(
    () => categorias
      .filter((c) => c.padre === CATEGORIA_UNIFORMES_ID)
      .map((c) => c.nombre),
    [categorias]
  );

  const categoriaMap = useMemo(() => {
    const map = {};
    categorias.forEach((c) => { map[c.nombre] = c.id; });
    return map;
  }, [categorias]);

  const uniformesFilters = useMemo(() => [
    {
      title: "Tipo de Uniforme",
      type: "checkbox",
      options: subcategorias,
    },
    {
      title: "Precio",
      type: "checkbox",
      options: ["Menos de $800", "$800 - $1,500", "Más de $1,500"],
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
          if (f === "Menos de $800")   return precio < 800;
          if (f === "$800 - $1,500")   return precio >= 800 && precio <= 1500;
          if (f === "Más de $1,500")   return precio > 1500;
          return false;
        });

      return categoriaOk && precioOk;
    });
  }, [productos, selected, subcategorias, categoriaMap]);

  return (
    <>
      <Header />
      <main className="container layout">
        <Filters config={uniformesFilters} onFilterChange={setSelected} />
        <section style={{ flex: 1 }}>
          <div className="listing-header">
            <h2>Uniformes ({productosFiltrados.length})</h2>
          </div>
          {error && <p className="auth-error">{error}</p>}
          <ProductGrid products={productosFiltrados} loading={loading} />
        </section>
      </main>
    </>
  );
}