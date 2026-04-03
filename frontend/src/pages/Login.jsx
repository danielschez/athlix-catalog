// src/pages/Login.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "../context/AuthContext";
import { registrarUsuario, loginUsuario } from "../api/auth";
import Header from "../components/Header";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export default function Login() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const recaptchaRef = useRef(null);

  const [modo,    setModo]    = useState("login");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ correo: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    nombre: "", correo: "", password: "", confirmPassword: "", telefono: "",
  });

  // ======================================================
  // LOGIN
  // ======================================================
  const handleLogin = async () => {
    setError("");
    if (!loginForm.correo || !loginForm.password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setLoading(true);
    try {
      const data = await loginUsuario(loginForm);
      login(data.usuario, { access: data.access, refresh: data.refresh });
      navigate("/");
    } catch (err) {
      setError(err?.detail || "Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // REGISTRO
  // ======================================================
  const handleRegister = async () => {
    setError("");
    const { nombre, correo, password, confirmPassword, telefono } = registerForm;

    if (!nombre || !correo || !password || !confirmPassword || !telefono) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(correo)) {
      setError("Ingresa un correo válido.");
      return;
    }

    // Verifica que el captcha fue resuelto
    const captchaToken = recaptchaRef.current?.getValue();
    if (!captchaToken) {
      setError("Por favor completa el reCAPTCHA.");
      return;
    }

    setLoading(true);
    try {
      await registrarUsuario({ nombre, correo, telefono, password, captchaToken });
      const data = await loginUsuario({ correo, password });
      login(data.usuario, { access: data.access, refresh: data.refresh });
      navigate("/");
    } catch (err) {
      recaptchaRef.current?.reset(); // resetea el captcha si hay error
      if (err?.correo)   { setError(err.correo[0]);   return; }
      if (err?.telefono) { setError(err.telefono[0]); return; }
      if (err?.captcha)  { setError(err.captcha[0]);  return; }
      setError("Ocurrió un error al registrarse. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="auth-page">
        <div className="auth-card">

          <div className="auth-tabs">
            <button
              className={`auth-tab ${modo === "login" ? "active" : ""}`}
              onClick={() => { setModo("login"); setError(""); }}
            >
              Iniciar sesión
            </button>
            <button
              className={`auth-tab ${modo === "registro" ? "active" : ""}`}
              onClick={() => { setModo("registro"); setError(""); }}
            >
              Registrarse
            </button>
          </div>

          {error && <p className="auth-error">{error}</p>}

          {/* LOGIN */}
          {modo === "login" && (
            <div className="auth-form">
              <label className="auth-label">Correo electrónico</label>
              <input
                className="auth-input" type="email" placeholder="correo@ejemplo.com"
                value={loginForm.correo}
                onChange={(e) => setLoginForm({ ...loginForm, correo: e.target.value })}
              />
              <label className="auth-label">Contraseña</label>
              <input
                className="auth-input" type="password" placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
              <button className="auth-submit-btn" onClick={handleLogin} disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </div>
          )}

          {/* REGISTRO */}
          {modo === "registro" && (
            <div className="auth-form">
              <label className="auth-label">Nombre completo</label>
              <input
                className="auth-input" type="text" placeholder="Juan Pérez"
                value={registerForm.nombre}
                onChange={(e) => setRegisterForm({ ...registerForm, nombre: e.target.value })}
              />
              <label className="auth-label">Correo electrónico</label>
              <input
                className="auth-input" type="email" placeholder="correo@ejemplo.com"
                value={registerForm.correo}
                onChange={(e) => setRegisterForm({ ...registerForm, correo: e.target.value })}
              />
              <label className="auth-label">Teléfono</label>
              <input
                className="auth-input" type="tel" placeholder="442 123 4567"
                value={registerForm.telefono}
                onChange={(e) => setRegisterForm({ ...registerForm, telefono: e.target.value })}
              />
              <label className="auth-label">Contraseña</label>
              <input
                className="auth-input" type="password" placeholder="Mínimo 6 caracteres"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              />
              <label className="auth-label">Repetir contraseña</label>
              <input
                className="auth-input" type="password" placeholder="••••••••"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
              />

              {/* reCAPTCHA — solo en registro */}
              <div style={{ margin: "12px 0" }}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                />
              </div>

              <button className="auth-submit-btn" onClick={handleRegister} disabled={loading}>
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </div>
          )}

        </div>
      </main>
    </>
  );
}