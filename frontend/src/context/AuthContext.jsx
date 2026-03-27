// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem("usuario");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (userData, tokens) => {
    setUser(userData);
    sessionStorage.setItem("usuario",       JSON.stringify(userData));
    sessionStorage.setItem("access_token",  tokens.access);
    sessionStorage.setItem("refresh_token", tokens.refresh);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}