import React, { createContext, useState, useCallback } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [clientId, setClientId] = useState(localStorage.getItem('clientId') || 'C001');

  const addToCart = useCallback((product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prevItems,
        {
          productId: product.id,
          product: product,
          quantity: 1,
          unitPrice: product.price,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    );
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  }, [items]);

  const value = {
    items,
    clientId,
    setClientId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
