// src/pages/Uniformes.jsx
import { useState } from "react";
import Header from "../components/Header";
import ProductGrid from "../components/ProductGrid";

export default function Uniformes() {
  const [products] = useState([
    {
      id: 1,
      name: "Uniforme Deportivo",
      category: "Uniformes",
      price: 899,
      image: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    },
    {
      id: 2,
      name: "Uniforme Escolar",
      category: "Uniformes",
      price: 799,
      image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
      tag: "Más vendido",
    },
  ]);

  return (
    <>
      <Header />

      <main className="container layout">
        <section style={{ flex: 1 }}>
          <div className="listing-header">
            <div className="listing-title">
              <h2>Uniformes ({products.length})</h2>
            </div>
          </div>

          <ProductGrid products={products} />
        </section>
      </main>
    </>
  );
}