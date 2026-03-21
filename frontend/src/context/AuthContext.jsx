// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("usuario");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData, tokens) => {
    setUser(userData);
    localStorage.setItem("usuario",       JSON.stringify(userData));
    localStorage.setItem("access_token",  tokens.access);
    localStorage.setItem("refresh_token", tokens.refresh);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
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