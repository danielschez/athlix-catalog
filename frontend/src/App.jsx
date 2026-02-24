// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Calzado from "./pages/Calzado";
import Ropa from "./pages/Ropa";
import Accesorios from "./pages/Accesorios";
import Carrito from "./pages/Carrito";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calzado" element={<Calzado />} />
        <Route path="/ropa" element={<Ropa />} />
        <Route path="/accesorios" element={<Accesorios />} />
        <Route path="/carrito" element={<Carrito />} />
      </Routes>
    </BrowserRouter>
  );
}
