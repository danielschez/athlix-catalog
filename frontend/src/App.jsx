// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Calzado from "./pages/Calzado";
import Ropa from "./pages/Ropa";
import Accesorios from "./pages/Accesorios";
import Gorras from "./pages/Gorras";
import Uniformes from "./pages/Uniformes";
import About from "./pages/About";
import Barberia from "./pages/Barberia";
import Carrito from "./pages/Carrito";
import Footer from "./components/Footer";

function AppWrapper() {
  const location = useLocation();

  // Ocultar footer si la ruta es "/carrito"
  const hiddenFooterRoutes = ["/carrito", "/barberia"];
  const showFooter = !hiddenFooterRoutes.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calzado" element={<Calzado />} />
        <Route path="/ropa" element={<Ropa />} />
        <Route path="/accesorios" element={<Accesorios />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/gorras" element={<Gorras />} />
        <Route path="/uniformes" element={<Uniformes />} />
        <Route path="/about" element={<About />} />
        <Route path="/barberia" element={<Barberia />} />
      </Routes>

      {showFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}