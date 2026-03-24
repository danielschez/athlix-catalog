// src/hooks/useProductos.js
import { useState, useEffect } from "react";
import { getProductos, getCategorias, getTallas } from "../api/productos";

export function useProductos(categoriaId = null) {
  const [productos,   setProductos]   = useState([]);
  const [categorias,  setCategorias]  = useState([]);
  const [tallas,      setTallas]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      setLoading(true);
      setError(null);
      try {
        const params = categoriaId ? { categoria: categoriaId } : {};
        const [prods, cats, talls] = await Promise.all([
          getProductos(params),
          getCategorias(),
          getTallas(),
        ]);
        if (!cancelado) {
          setProductos(prods);
          setCategorias(cats);
          setTallas(talls);
        }
      } catch (err) {
        if (!cancelado) setError(err.message);
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    cargar();
    return () => { cancelado = true; };
  }, [categoriaId]);

  return { productos, categorias, tallas, loading, error };
}