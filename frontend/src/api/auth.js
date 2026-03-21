// src/api/auth.js
const BASE_URL = "http://127.0.0.1:8000/api";

export async function registrarUsuario({ nombre, correo, telefono, password }) {
  const res = await fetch(`${BASE_URL}/usuarios/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, correo, telefono, password }),
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function loginUsuario({ correo, password }) {
  const res = await fetch(`${BASE_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, password }),
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Llama a endpoints protegidos con el token
export async function fetchConAuth(url, opciones = {}) {
  const access = localStorage.getItem("access_token");

  const res = await fetch(`${BASE_URL}${url}`, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access}`,
      ...opciones.headers,
    },
  });

  if (res.status === 401) {
    // Token expirado — intenta refrescar
    const refreshed = await refrescarToken();
    if (!refreshed) {
      window.location.href = "/login";
      return;
    }
    // Reintenta con el nuevo token
    return fetchConAuth(url, opciones);
  }

  return res.json();
}

async function refrescarToken() {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return false;

  const res = await fetch(`${BASE_URL}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) return false;

  const data = await res.json();
  localStorage.setItem("access_token", data.access);
  return true;
}