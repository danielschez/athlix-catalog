// src/pages/Calzado.jsx
import { useState, useMemo } from "react";
import Header from "../components/Header";
import Filters from "../components/Filters";
import ProductGrid from "../components/ProductGrid";
import { useProductos } from "../hooks/useProductos";

const CATEGORIA_CALZADO_ID = 1;

export default function Calzado() {
  const { productos, tallas, categorias, loading, error } = useProductos(CATEGORIA_CALZADO_ID);
  const [selected, setSelected] = useState([]);

  // Subcategorías hijas de Calzado para el filtro de Categoría
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

  const tallaMap = useMemo(() => {
    const map = {};
    tallasCalzado.forEach((t) => { map[t.id] = t.talla; });
    return map;
  }, [tallasCalzado]);

  // Mapa nombre de categoría → id para filtrar
  const categoriaMap = useMemo(() => {
    const map = {};
    categorias.forEach((c) => { map[c.nombre] = c.id; });
    return map;
  }, [categorias]);

  const calzadoFilters = useMemo(() => [
    {
      title: "Categoría",
      type: "checkbox",
      options: subcategorias,   // ← dinámico desde la API
    },
    {
      title: "Tallas",
      type: "buttons",
      options: tallasCalzado.map((t) => t.talla),
    },
  ], [subcategorias, tallasCalzado]);

  const productosFiltrados = useMemo(() => {
    if (selected.length === 0) return productos;

    // Separa seleccionados entre categorías y tallas
    const categoriasSeleccionadas = selected.filter((s) => subcategorias.includes(s));
    const tallasSeleccionadas     = selected.filter((s) => !subcategorias.includes(s));

    return productos.filter((p) => {
      const categoriaOk = categoriasSeleccionadas.length === 0
        || categoriasSeleccionadas.some((nombre) => categoriaMap[nombre] === p.categoria);

      const tallaOk = tallasSeleccionadas.length === 0
        || p.tallas?.some((id) => tallasSeleccionadas.includes(tallaMap[id]));

      return categoriaOk && tallaOk;
    });
  }, [productos, selected, subcategorias, categoriaMap, tallaMap]);

  return (
    <>
      <Header />
      <main className="container layout">
        <Filters config={calzadoFilters} onFilterChange={setSelected} />
        <section style={{ flex: 1 }}>
          <div className="listing-header">
            <h2>Calzado ({productosFiltrados.length})</h2>
          </div>
          {error && <p className="auth-error">{error}</p>}
          <ProductGrid products={productosFiltrados} loading={loading} />
        </section>
      </main>
    </>
  );
}