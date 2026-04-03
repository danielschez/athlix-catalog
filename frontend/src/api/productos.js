// src/api/productos.js
const BASE_URL = import.meta.env.VITE_API_URL;

export async function getProductos(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res   = await fetch(`${BASE_URL}/api/productos/${query ? "?" + query : ""}`);
  if (!res.ok) throw new Error("Error al cargar productos");
  return res.json();
}

export async function getCategorias() {
  const res = await fetch(`${BASE_URL}/api/categorias/`);
  if (!res.ok) throw new Error("Error al cargar categorías");
  return res.json();
}

export async function getTallas() {
  const res = await fetch(`${BASE_URL}/api/tallas/`);
  if (!res.ok) throw new Error("Error al cargar tallas");
  return res.json();
}