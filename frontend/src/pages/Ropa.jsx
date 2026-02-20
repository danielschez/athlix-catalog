import { useState } from "react";
import Header from "../components/Header";
import ProductGrid from "../components/ProductGrid";
import Seo from "../components/Seo";

const ALL_PRODUCTS = [
  {
    id: 1,
    name: "Playera Nike Dri-FIT",
    gender: "Hombre",
    size: ["S", "M", "L"],
    price: 799,
    image: "https://images.unsplash.com/photo-1520975682031-a4c8a6b8c2c5",
  },
  {
    id: 2,
    name: "Sudadera Nike Sportswear",
    gender: "Mujer",
    size: ["M", "L"],
    price: 1499,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2",
  },
  {
    id: 3,
    name: "Conjunto Infantil Nike",
    gender: "Niño",
    size: ["XS", "S"],
    price: 999,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990",
  },
];

export default function Ropa() {
  const [gender, setGender] = useState("Todos");
  const [size, setSize] = useState("Todas");

  const filteredProducts = ALL_PRODUCTS.filter((p) => {
    const genderMatch = gender === "Todos" || p.gender === gender;
    const sizeMatch = size === "Todas" || p.size.includes(size);
    return genderMatch && sizeMatch;
  });

  return (
    <>
      <Seo
        title="Ropa Deportiva | Tienda"
        description="Explora ropa deportiva para hombre, mujer y niños."
      />

      <Header />

      <main className="container layout">
        {/* FILTROS */}
        <aside className="filters">
          <h3>Género</h3>
          {["Todos", "Hombre", "Mujer", "Niño", "Niña"].map((g) => (
            <button
              key={g}
              className={gender === g ? "active" : ""}
              onClick={() => setGender(g)}
            >
              {g}
            </button>
          ))}

          <h3>Talla</h3>
          {["Todas", "XS", "S", "M", "L", "XL"].map((s) => (
            <button
              key={s}
              className={size === s ? "active" : ""}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </aside>

        {/* LISTADO */}
        <section style={{ flex: 1 }}>
          <div className="listing-header">
            <h2>Ropa ({filteredProducts.length})</h2>
          </div>

          <ProductGrid products={filteredProducts} />
        </section>
      </main>
    </>
  );
}