// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const itemKey = (item) =>
  `${item.id}-${item.talla_id || "sin-talla"}`;

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = sessionStorage.getItem("carrito");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    sessionStorage.setItem("carrito", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const key = itemKey(product);

      const existing = prev.find((item) => itemKey(item) === key);

      if (existing) {
        return prev.map((item) =>
          itemKey(item) === key
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (key) => {
    setCart((prev) => prev.filter((item) => itemKey(item) !== key));
  };

  const clearCart = () => {
    setCart([]);
    sessionStorage.removeItem("carrito");
  };

  const updateQuantity = (key, action) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (itemKey(item) !== key) return item;

          const newQuantity =
            action === "increase"
              ? item.quantity + 1
              : item.quantity - 1;

          return {
            ...item,
            quantity: newQuantity,
          };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const totalItems = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (acc, item) =>
      acc + Number(item.precio || item.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        totalItems,
        totalPrice,
        itemKey,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);