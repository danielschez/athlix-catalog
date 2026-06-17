// src/pages/Home.jsx
import Header from "../components/Header";
import { Link } from "react-router-dom";

const categories = [
  {
    title: "Calzado",
    image: "/images/Tenis.jpeg",
    path: "/calzado",
  },
  {
    title: "Ropa",
    image: "/images/Ropa.jpeg",
    path: "/ropa",
  },
  {
    title: "Gorras",
    image: "/images/Gorras.jpeg",
    path: "/gorras",
  },
  {
    title: "Jerseys",
    image: "/images/Jersey.jpeg",
    path: "/jerseys",
  },
  {
    title: "Uniformes",
    image: "/images/Uniformes.jpeg",
    path: "/uniformes",
  },
  {
    title: "Accesorio y Complementos",
    image: "/images/Acessorios.jpeg",
    path: "/accesorios",
  },
];

export default function Home() {
  return (
    <>
      <Header />

      <main className="container" style={{ paddingTop: "40px" }}>
        <h1 style={{ marginBottom: "30px" }}>Compra por categoría</h1>

        <div className="category-grid">
          {categories.map((cat) => (
            <Link to={cat.path} key={cat.title} className="category-card">
              <img src={cat.image} alt={cat.title} />
              <div className="category-overlay">
                <h2>{cat.title}</h2>
                <button>Seleccionar</button>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
