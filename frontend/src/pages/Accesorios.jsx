//src/pages/Accesorios.jsx
import Header from "../components/Header";
import Filters from "../components/Filters";
import ProductGrid from "../components/ProductGrid";
import Seo from "../components/Seo";

const PRODUCTS = [
  {
    id: 1,
    name: "Mochila Nike Brasilia",
    price: 999,
    image: "https://images.unsplash.com/photo-1585386959984-a41552231693",
  },
  {
    id: 2,
    name: "Gorra Nike Heritage",
    price: 499,
    image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0",
  },
  {
    id: 3,
    name: "Calcetas Nike Everyday",
    price: 299,
    image: "https://images.unsplash.com/photo-1589187151053-5ec8818e661b",
  },
];

const accesoriosFilters = [
  {
    title: "Categoría",
    type: "checkbox",
    options: [
      "Bolsas & Mochilas",
      "Balones",
      "Cinturones",
      "Lentes",
      "Figuras Coleccionables",
      "Otros",
    ],
  },
  {
    title: "Precio",
    type: "checkbox",
    options: [
      "Menos de $500",
      "$500 - $1,000",
      "Más de $1,000",
    ],
  },
];

export default function Accesorios() {
  return (
    <>
      <Seo
        title="Accesorios | Tienda"
        description="Descubre mochilas, gorras y accesorios deportivos."
      />

      <Header />

      <main className="container layout">
        <Filters config={accesoriosFilters} />

        <section style={{ flex: 1 }}>
          <div className="listing-header">
            <h2>Accesorios ({PRODUCTS.length})</h2>
          </div>

          <ProductGrid products={PRODUCTS} />
        </section>
      </main>
    </>
  );
}