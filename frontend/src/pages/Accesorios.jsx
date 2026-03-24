// src/pages/Accesorios.jsx
import { useState, useMemo } from "react";
import Header from "../components/Header";
import Filters from "../components/Filters";
import ProductGrid from "../components/ProductGrid";
import Seo from "../components/Seo";
import { useProductos } from "../hooks/useProductos";

const CATEGORIA_ACCESORIOS_ID = 3; // ID de categoría para accesorios, debe coincidir con el backend

export default function Accesorios() {
  const { productos, loading, error } = useProductos(CATEGORIA_ACCESORIOS_ID);
  const [selected, setSelected] = useState([]);

  const accesoriosFilters = [
    {
      title: "Categoría",
      type: "checkbox",
      options: ["Bolsas & Mochilas", "Balones", "Cinturones", "Lentes", "Otros"],
    },
    {
      title: "Precio",
      type: "checkbox",
      options: ["Menos de $500", "$500 - $1,000", "Más de $1,000"],
    },
  ];

  // Filtro de precio en el cliente
  const productosFiltrados = useMemo(() => {
    if (selected.length === 0) return productos;
    return productos.filter((p) => {
      const precio = Number(p.precio);
      return selected.some((f) => {
        if (f === "Menos de $500")    return precio < 500;
        if (f === "$500 - $1,000")    return precio >= 500 && precio <= 1000;
        if (f === "Más de $1,000")    return precio > 1000;
        return false;
      });
    });
  }, [productos, selected]);

  return (
    <>
      <Seo title="Accesorios | Tienda" description="Descubre accesorios deportivos." />
      <Header />
      <main className="container layout">
        <Filters config={accesoriosFilters} onFilterChange={setSelected} />
        <section style={{ flex: 1 }}>
          <div className="listing-header">
            <h2>Accesorios ({productosFiltrados.length})</h2>
          </div>
          {error && <p className="auth-error">{error}</p>}
          <ProductGrid products={productosFiltrados} loading={loading} />
        </section>
      </main>
    </>
  );
}