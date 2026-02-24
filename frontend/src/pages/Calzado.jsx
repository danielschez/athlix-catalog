// src/pages/Calzado.jsx
import { useState } from "react";
import Header from "../components/Header";
import Filters from "../components/Filters";
import ProductGrid from "../components/ProductGrid";

export default function Home() {
  const [products] = useState([
    {
      id: 1,
      name: "Nike Air Max 90",
      category: "Calzado para Hombre",
      price: 2599,
      colors: 3,
      tag: "Recién llegado",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    },
    {
      id: 2,
      name: "Nike Revolution 7",
      category: "Calzado de running para carretera para hombre",
      price: 2999,
      colors: 2,
      image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
    },
    {
      id: 3,
      name: "Nike Downshifter 12",
      category: "Calzado de running para hombre",
      price: 2199,
      colors: 4,
      image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
    },
    {
      id: 4,
      name: "Nike Pegasus 40",
      category: "Calzado de running para hombre",
      price: 3499,
      colors: 5,
      tag: "Sostenible",
      image: "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f",
    },
    {
      id: 5,
      name: "Nike Zoom Fly 5",
      category: "Calzado de running para carretera para hombre",
      price: 3799,
      colors: 2,
      image: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6",
    },
    {
      id: 6,
      name: "Nike React Infinity",
      category: "Calzado de running para hombre",
      price: 2899,
      colors: 3,
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
    },
    {
      id: 7,
      name: "Nike Air Max 90",
      category: "Calzado para Hombre",
      price: 2599,
      colors: 3,
      tag: "Recién llegado",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    },
    {
      id: 8,
      name: "Nike Revolution 7",
      category: "Calzado de running para carretera para hombre",
      price: 2999,
      colors: 2,
      image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
    },
  ]);

  return (
    <>
      <Header />

      <main className="container layout">
        <Filters />

        <section style={{ flex: 1 }}>
          <div className="listing-header">
            <div className="listing-title">
              <h2>Calzado ({products.length})</h2>
               <button onClick={() => addToCart(producto)}>
                Agregar al carrito
              </button>
            </div>
          </div>

          <ProductGrid products={products} />
        </section>
      </main>
    </>
  );
}