// src/api/productos.js
const BASE_URL = "http://127.0.0.1:8000/api";

export async function getProductos(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/productos/${query ? "?" + query : ""}`);
  if (!res.ok) throw new Error("Error al cargar productos");
  return res.json();
}

export async function getCategorias() {
  const res = await fetch(`${BASE_URL}/categorias/`);
  if (!res.ok) throw new Error("Error al cargar categorías");
  return res.json();
}

export async function getTallas() {
  const res = await fetch(`${BASE_URL}/tallas/`);
  if (!res.ok) throw new Error("Error al cargar tallas");
  return res.json();
}