// src/pages/Gorras.jsx
import { useState } from "react";
import Header from "../components/Header";
import ProductGrid from "../components/ProductGrid";
import { useCart } from "../context/CartContext";

export default function Gorras() {
  const { addToCart } = useCart();

  const [products] = useState([
    {
      id: 1,
      name: "Gorra Snapback Negra",
      category: "Gorras",
      price: 499,
      image: "https://images.unsplash.com/photo-1521369909029-2afed882baee",
      tag: "Nueva",
    },
    {
      id: 2,
      name: "Gorra Trucker Roja",
      category: "Gorras",
      price: 599,
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
    },
  ]);

  return (
    <>
      <Header />

      <main className="container layout">
        <section style={{ flex: 1 }}>
          <div className="listing-header">
            <div className="listing-title">
              <h2>Gorras ({products.length})</h2>
            </div>
          </div>

          <ProductGrid products={products} />
        </section>
      </main>
    </>
  );
}