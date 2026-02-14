import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "./context/CartContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </HelmetProvider>
);
