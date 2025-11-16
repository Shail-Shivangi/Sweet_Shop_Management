import React, { createContext, useContext, useState } from "react";
import { useMessages } from "./MessageContext";

const CartContext = createContext();

// Helper to get initial state from localStorage
const getInitialCart = () => {
  try {
    const storedCart = localStorage.getItem("ss_cart");
    // Ensure that if localStorage is empty, we return an empty array
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Error loading cart from local storage:", error);
    return [];
  }
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getInitialCart);
  const { showMessage } = useMessages();

  // Helper to save cart state
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem("ss_cart", JSON.stringify(items));
  };

  function addToCart(sweet, quantity = 1) {
    const newQuantity = Number(quantity);
    if (newQuantity <= 0) return;

    // The sweet object coming from SweetContext holds the current stock (quantity)
    const existingItem = cartItems.find(item => item.id === sweet.id);
    const availableStock = Number(sweet.quantity);

    if (existingItem) {
      // Check stock limit for update
      const totalQuantity = existingItem.quantity + newQuantity;
      if (totalQuantity > availableStock) {
        showMessage(`Cannot add ${newQuantity} kg. Only ${availableStock - existingItem.quantity} kg of ${sweet.name} left in stock!`, 'error');
        return;
      }
      
      const updatedItems = cartItems.map(item =>
        item.id === sweet.id
          ? { ...item, quantity: totalQuantity }
          : item
      );
      saveCart(updatedItems);
      showMessage(`Added ${newQuantity} box more of ${sweet.name} to cart.`, 'success');
    } else {
      // Check stock limit for new item
      if (newQuantity > availableStock) {
        showMessage(`Cannot add ${newQuantity} kg. Only ${availableStock} kg of ${sweet.name} is available.`, 'error');
        return;
      }
      // Add new item
      const newItem = {
        id: sweet.id,
        name: sweet.name,
        price: sweet.price,
        image: sweet.image,
        quantity: newQuantity, // Quantity in the cart
      };
      saveCart([...cartItems, newItem]);
      showMessage(`Added ${newQuantity} box of ${sweet.name} to cart.`, 'success');
    }
  }

  function removeFromCart(id) {
    const updatedItems = cartItems.filter(item => item.id !== id);
    saveCart(updatedItems);
    showMessage("Item removed from cart.", 'error');
  }

  function clearCart() {
    saveCart([]);
    showMessage("Cart cleared.", 'error');
  }
  
  // Calculate total price and total items in cart
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);


  return (
    <CartContext.Provider value={{ 
      cartItems, 
      cartTotal, 
      totalItems, 
      addToCart, 
      removeFromCart, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}