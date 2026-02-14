// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Calzado from "./pages/Calzado";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calzado" element={<Calzado />} />
      </Routes>
    </BrowserRouter>
  );
}
