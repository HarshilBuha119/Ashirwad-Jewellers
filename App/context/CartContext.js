import React, { createContext, useContext, useState, useMemo } from 'react';
import { useCreateOrder } from '../hooks/useStore';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { mutateAsync: serverCreateOrder } = useCreateOrder();

  // 1. ADD: Logic to check if item exists (to increase quantity instead of duplicating)
  const addToCart = (product, options) => {
    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => 
          item.id === product.id && 
          item.color === options.color && 
          item.carat === options.carat
      );

      if (existingItemIndex > -1) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      }
      
      // If it's a new unique combination, add it
      return [...prev, { ...product, ...options, quantity: 1, cartId: Date.now() }];
    });
  };

  // 2. UPDATE QUANTITY: Used by the + and - buttons in CartScreen
  const updateQuantity = (index, change) => {
    setCartItems((prev) => {
      const newCart = [...prev];
      const newQty = newCart[index].quantity + change;
      if (newQty > 0) {
        newCart[index].quantity = newQty;
      }
      return newCart;
    });
  };

  // 3. REMOVE ITEM: Used by the trash icon
  const removeItem = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // 4. CALCULATIONS: useMemo keeps these efficient
  const subtotal = useMemo(() => 
    cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0), 
  [cartItems]);

  const shipping = cartItems.length > 0 ? 15 : 0;
  const total = subtotal + shipping;

  const placeOrder = async (customerInfo) => {
  // Ensure we are using 'total' which we calculated in the provider
  const orderData = {
    items: cartItems, // This is saved as a JSONB block in Supabase
    total_amount: total, 
    customer_info: customerInfo,
    status: 'placed'
  };
  
  try {
    const result = await serverCreateOrder(orderData);
    if (result) {
      setCartItems([]); // Only clear if successful
      return result;
    }
  } catch (e) {
    console.error("Order failed:", e);
    throw e;
  }
};

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      updateQuantity, 
      removeItem, 
      subtotal, 
      shipping, 
      total, 
      placeOrder 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);