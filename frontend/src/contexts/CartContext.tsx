"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { type Cart, getCart, syncLocalStorageCartToDatabase, getLocalStorageCart } from "@/lib/api/cart";
import { isAuthenticated } from "@/lib/api/auth";

type CartContextType = {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cart: Cart | null;
  cartItemCount: number;
  refreshCart: () => Promise<void>;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wasAuthenticated, setWasAuthenticated] = useState<boolean | null>(null);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const refreshCart = async () => {
    try {
      setIsLoading(true);
      const cartData = await getCart();
      setCart(cartData);
    } catch (error) {
      console.error("Failed to refresh cart:", error);
      // Fallback to localStorage if API fails
      const localCart = getLocalStorageCart();
      setCart(localCart);
    } finally {
      setIsLoading(false);
    }
  };

  // Load cart on mount and check for sync needed
  useEffect(() => {
    const loadCartAndSync = async () => {
      const currentlyAuthenticated = isAuthenticated();
      setWasAuthenticated(currentlyAuthenticated);
      
      // If user is authenticated on mount, check if localStorage cart needs syncing
      if (currentlyAuthenticated) {
        const localCart = getLocalStorageCart();
        if (localCart.items.length > 0) {
          try {
            // Sync localStorage cart to database
            await syncLocalStorageCartToDatabase();
            // Refresh to get merged cart
            await refreshCart();
            return;
          } catch (error) {
            console.error("Failed to sync cart on mount:", error);
            // Continue to refresh cart even if sync fails
          }
        }
      }
      
      // Normal cart load
      await refreshCart();
    };
    
    loadCartAndSync();
  }, []);

  // Monitor authentication state changes and sync cart when user logs in
  useEffect(() => {
    const checkAuthAndSync = async () => {
      const currentlyAuthenticated = isAuthenticated();

      // If user just logged in (wasn't authenticated before, now is)
      if (wasAuthenticated === false && currentlyAuthenticated) {
        try {
          // Check if there are items in localStorage to sync
          const localCart = getLocalStorageCart();
          if (localCart.items.length > 0) {
            // Sync localStorage cart to database
            await syncLocalStorageCartToDatabase();
          }
          // Refresh cart to get merged data (or database cart if localStorage was empty)
          await refreshCart();
        } catch (error) {
          console.error("Failed to sync cart on login:", error);
          // Still refresh cart even if sync fails
          await refreshCart();
        }
      }

      // If user just logged out (was authenticated before, now isn't)
      if (wasAuthenticated === true && !currentlyAuthenticated) {
        // Just refresh to get localStorage cart
        await refreshCart();
      }

      setWasAuthenticated(currentlyAuthenticated);
    };

    // Only run sync check if wasAuthenticated has been initialized
    if (wasAuthenticated !== null) {
      checkAuthAndSync();
    }
  }, [wasAuthenticated]);

  // Also listen for storage events (in case of multiple tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_token" || e.key === "shopping_cart") {
        refreshCart();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const cartItemCount = cart?.total_items || 0;

  return (
    <CartContext.Provider value={{ 
      isCartOpen, 
      openCart, 
      closeCart, 
      cart,
      cartItemCount,
      refreshCart,
      isLoading,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
