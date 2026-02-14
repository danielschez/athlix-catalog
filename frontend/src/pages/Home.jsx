// src/pages/Home.jsx
import Header from "../components/Header";
import { Link } from "react-router-dom";

const categories = [
  {
    title: "Calzado",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    path: "/calzado",
  },
  {
    title: "Ropa",
    image: "https://images.unsplash.com/photo-1521334884684-d80222895322",
    path: "/ropa",
  },
  {
    title: "Accesorios",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
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
                <button>Comprar</button>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
