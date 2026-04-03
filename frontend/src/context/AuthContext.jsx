// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const SESSION_DURATION = 60 * 60 * 1000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved    = sessionStorage.getItem("usuario");
      const expiry   = sessionStorage.getItem("session_expiry");
      if (!saved || !expiry) return null;

      if (Date.now() > parseInt(expiry)) {
        sessionStorage.clear();
        return null;
      }

      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const expiry = sessionStorage.getItem("session_expiry");
      if (expiry && Date.now() > parseInt(expiry)) {
        logout();
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const login = (userData, tokens) => {
    const expiry = Date.now() + SESSION_DURATION;
    setUser(userData);
    sessionStorage.setItem("usuario",         JSON.stringify(userData));
    sessionStorage.setItem("access_token",    tokens.access);
    sessionStorage.setItem("refresh_token",   tokens.refresh);
    sessionStorage.setItem("session_expiry",  String(expiry));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.clear();
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