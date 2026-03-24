// src/pages/Calzado.jsx
import { useState, useMemo } from "react";
import Header from "../components/Header";
import Filters from "../components/Filters";
import ProductGrid from "../components/ProductGrid";
import { useProductos } from "../hooks/useProductos";

const CATEGORIA_CALZADO_ID = 1;

export default function Calzado() {
  const { productos, tallas, loading, error } = useProductos(CATEGORIA_CALZADO_ID);
  const [selected, setSelected] = useState([]);

  const calzadoFilters = useMemo(() => [
    {
      title: "Categoría",
      type: "checkbox",
      options: ["Sneakers", "Tachos de Fútbol", "Bebés & Niños", "Sandalias & Chanclas", "Ofertas"],
    },
    {
      title: "Tallas",
      type: "buttons",
      options: tallas
        .filter((t) => t.tipo === "calzado")
        .map((t) => t.talla),
    },
  ], [tallas]);

  // Filtra productos por talla seleccionada
  const productosFiltrados = useMemo(() => {
    if (selected.length === 0) return productos;
    return productos.filter((p) =>
      p.tallas?.some((t) => selected.includes(t))
    );
  }, [productos, selected]);

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