import { useState, useEffect } from "react";
import { storage } from "@/utils/storage";
import { toast } from "react-toastify";

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = storage.get("cart", []);
    setCartItems(savedCart);
  }, []);

  const saveCart = (items) => {
    setCartItems(items);
    storage.set("cart", items);
  };

  const addToCart = (product, quantity = 1, selectedVariation = null) => {
    const existingItemIndex = cartItems.findIndex(
      item => item.productId === product.Id && 
      JSON.stringify(item.selectedVariation) === JSON.stringify(selectedVariation)
    );

    if (existingItemIndex > -1) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += quantity;
      saveCart(updatedItems);
    } else {
      const newItem = {
        productId: product.Id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images[0],
        selectedVariation
      };
      saveCart([...cartItems, newItem]);
    }
    
    toast.success(`${product.name} added to cart!`);
  };

  const updateQuantity = (productId, selectedVariation, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, selectedVariation);
      return;
    }

    const updatedItems = cartItems.map(item => {
      if (item.productId === productId && 
          JSON.stringify(item.selectedVariation) === JSON.stringify(selectedVariation)) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    saveCart(updatedItems);
  };

  const removeFromCart = (productId, selectedVariation) => {
    const updatedItems = cartItems.filter(item => 
      !(item.productId === productId && 
        JSON.stringify(item.selectedVariation) === JSON.stringify(selectedVariation))
    );
    saveCart(updatedItems);
    toast.info("Item removed from cart");
  };

  const clearCart = () => {
    saveCart([]);
    storage.remove("cart");
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount
  };
};