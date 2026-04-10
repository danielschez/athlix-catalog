// src/pages/Calzado.jsx
import { useState, useMemo, useCallback } from "react";
import Header from "../components/Header";
import Filters from "../components/Filters";
import ProductGrid from "../components/ProductGrid";
import { useProductos } from "../hooks/useProductos";

const CATEGORIA_CALZADO_ID = 1;

export default function Calzado() {
  const { productos, tallas, categorias, loading, error } = useProductos(CATEGORIA_CALZADO_ID);
  const [selected, setSelected]           = useState([]);
  const [tallasMap, setTallasMap]         = useState({}); // { productoId: tallaObj }

  const handleFilterChange = useCallback((filters) => {
    setSelected(filters);
  }, []);

  const handleTallaChange = useCallback((productoId, talla) => {
    setTallasMap(prev => ({ ...prev, [productoId]: talla }));
  }, []);

  const subcategorias = useMemo(
    () => categorias
      .filter((c) => c.padre === CATEGORIA_CALZADO_ID)
      .map((c) => c.nombre),
    [categorias]
  );

  const tallasCalzado = useMemo(
    () => tallas.filter((t) => t.tipo === "calzado"),
    [tallas]
  );

  const categoriaMap = useMemo(() => {
    const map = {};
    categorias.forEach((c) => { map[c.nombre] = c.id; });
    return map;
  }, [categorias]);

  const calzadoFilters = useMemo(() => [
    {
      title: "Categoría",
      type: "checkbox",
      options: subcategorias,
    },
    {
      title: "Tallas",
      type: "buttons",
      options: tallasCalzado.map((t) => t.talla),
    },
  ], [subcategorias, tallasCalzado]);

  const productosFiltrados = useMemo(() => {
    if (selected.length === 0) return productos;
    const categoriasSeleccionadas = selected.filter((s) => subcategorias.includes(s));
    const tallasSeleccionadas     = selected.filter((s) => !subcategorias.includes(s));
    return productos.filter((p) => {
      const categoriaOk = categoriasSeleccionadas.length === 0
        || categoriasSeleccionadas.some((nombre) => categoriaMap[nombre] === p.categoria);
      const tallaOk = tallasSeleccionadas.length === 0
        || p.tallas?.some((t) => tallasSeleccionadas.includes(t.talla_nombre));
      return categoriaOk && tallaOk;
    });
  }, [productos, selected, subcategorias, categoriaMap]);

  return (
    <>
      <Header />
      <main className="container layout">
        <Filters config={calzadoFilters} onFilterChange={handleFilterChange} />
        <section style={{ flex: 1 }}>
          <div className="listing-header">
            <h2>Calzado ({productosFiltrados.length})</h2>
          </div>
          {error && <p className="auth-error">{error}</p>}
          <ProductGrid
            products={productosFiltrados}
            loading={loading}
            tallasSeleccionadas={tallasMap}
            onTallaChange={handleTallaChange}
          />
        </section>
      </main>
    </>
  );
}