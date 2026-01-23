import { getToken, isAuthenticated } from "./auth";

export type CartItem = {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  product_price: string;
  brand_name: string;
  quantity: number;
  subtotal: string;
};

export type Cart = {
  items: CartItem[];
  subtotal: string;
  total_items: number;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost";
const CART_STORAGE_KEY = "shopping_cart";

// LocalStorage cart management
export function getLocalStorageCart(): Cart {
  if (typeof window === "undefined") {
    return { items: [], subtotal: "0.00", total_items: 0 };
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to parse localStorage cart:", error);
  }

  return { items: [], subtotal: "0.00", total_items: 0 };
}

export function saveLocalStorageCart(cart: Cart): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
}

export function clearLocalStorageCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_STORAGE_KEY);
}

// Calculate cart totals from items
function calculateCartTotals(items: CartItem[]): { subtotal: string; total_items: number } {
  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
  const total_items = items.reduce((sum, item) => sum + item.quantity, 0);
  return {
    subtotal: subtotal.toFixed(2),
    total_items,
  };
}

export async function getCart(): Promise<Cart> {
  // If not authenticated, return localStorage cart
  if (!isAuthenticated()) {
    return getLocalStorageCart();
  }

  const token = getToken();
  if (!token) {
    return getLocalStorageCart();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { items: [], subtotal: "0.00", total_items: 0 };
      }
      // Fallback to localStorage on error
      return getLocalStorageCart();
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch cart from API:", error);
    // Fallback to localStorage on error
    return getLocalStorageCart();
  }
}

// Fetch product details for localStorage cart
async function getProductDetails(productId: number): Promise<{
  id: number;
  name: string;
  profile_pic_link: string;
  price: string;
  brand_name: string;
}> {
  const response = await fetch(`${API_BASE_URL}/api/products/${productId}/`);
  if (!response.ok) {
    throw new Error("Failed to fetch product details");
  }
  const product = await response.json();
  return {
    id: product.id,
    name: product.name,
    profile_pic_link: product.profile_pic_link,
    price: product.price,
    brand_name: product.brand || "",
  };
}

export async function addToCart(productId: number, quantity: number): Promise<Cart> {
  // If not authenticated, use localStorage
  if (!isAuthenticated()) {
    const currentCart = getLocalStorageCart();
    const existingItemIndex = currentCart.items.findIndex(
      (item) => item.product_id === productId
    );

    let updatedItems: CartItem[];

    if (existingItemIndex >= 0) {
      // Update existing item
      updatedItems = [...currentCart.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
        subtotal: (
          parseFloat(updatedItems[existingItemIndex].product_price) *
          (updatedItems[existingItemIndex].quantity + quantity)
        ).toFixed(2),
      };
    } else {
      // Add new item - need to fetch product details
      const product = await getProductDetails(productId);
      const newItem: CartItem = {
        id: Date.now(), // Use timestamp as temporary ID
        product_id: productId,
        product_name: product.name,
        product_image: product.profile_pic_link,
        product_price: product.price,
        brand_name: product.brand_name,
        quantity,
        subtotal: (parseFloat(product.price) * quantity).toFixed(2),
      };
      updatedItems = [...currentCart.items, newItem];
    }

    const totals = calculateCartTotals(updatedItems);
    const updatedCart: Cart = {
      items: updatedItems,
      ...totals,
    };

    saveLocalStorageCart(updatedCart);
    return updatedCart;
  }

  // Authenticated: use API
  const token = getToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/api/cart/add/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      product_id: productId,
      quantity,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add item to cart");
  }

  return response.json();
}

export async function updateCartItem(productId: number, quantity: number): Promise<Cart> {
  // If not authenticated, use localStorage
  if (!isAuthenticated()) {
    const currentCart = getLocalStorageCart();
    const itemIndex = currentCart.items.findIndex(
      (item) => item.product_id === productId
    );

    if (itemIndex < 0) {
      throw new Error("Item not found in cart");
    }

    let updatedItems: CartItem[];

    if (quantity === 0) {
      // Remove item
      updatedItems = currentCart.items.filter(
        (item) => item.product_id !== productId
      );
    } else {
      // Update quantity
      updatedItems = [...currentCart.items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity,
        subtotal: (
          parseFloat(updatedItems[itemIndex].product_price) * quantity
        ).toFixed(2),
      };
    }

    const totals = calculateCartTotals(updatedItems);
    const updatedCart: Cart = {
      items: updatedItems,
      ...totals,
    };

    saveLocalStorageCart(updatedCart);
    return updatedCart;
  }

  // Authenticated: use API
  const token = getToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/api/cart/update/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      product_id: productId,
      quantity,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update cart item");
  }

  return response.json();
}

export async function removeCartItem(productId: number): Promise<Cart> {
  // If not authenticated, use localStorage
  if (!isAuthenticated()) {
    const currentCart = getLocalStorageCart();
    const updatedItems = currentCart.items.filter(
      (item) => item.product_id !== productId
    );

    const totals = calculateCartTotals(updatedItems);
    const updatedCart: Cart = {
      items: updatedItems,
      ...totals,
    };

    saveLocalStorageCart(updatedCart);
    return updatedCart;
  }

  // Authenticated: use API
  const token = getToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/api/cart/remove/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      product_id: productId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to remove cart item");
  }

  return response.json();
}

// Sync localStorage cart to database when user logs in
export async function syncLocalStorageCartToDatabase(): Promise<Cart> {
  const localCart = getLocalStorageCart();
  
  if (localCart.items.length === 0) {
    // No items to sync, just return current database cart
    return getCart();
  }

  const token = getToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  // Get current database cart to check for existing items
  let dbCart: Cart;
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      dbCart = await response.json();
    } else {
      dbCart = { items: [], subtotal: "0.00", total_items: 0 };
    }
  } catch (error) {
    console.error("Failed to fetch database cart:", error);
    dbCart = { items: [], subtotal: "0.00", total_items: 0 };
  }

  // Merge localStorage items with database cart
  // For each localStorage item, add it to database (backend will merge quantities)
  const syncErrors: string[] = [];
  
  for (const item of localCart.items) {
    try {
      const existingItem = dbCart.items.find(
        (dbItem) => dbItem.product_id === item.product_id
      );

      if (existingItem) {
        // Item exists in both - add the localStorage quantity to database
        const totalQuantity = existingItem.quantity + item.quantity;
        const response = await fetch(`${API_BASE_URL}/api/cart/update/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: item.product_id,
            quantity: totalQuantity,
          }),
        });
        
        if (!response.ok) {
          const error = await response.json();
          syncErrors.push(`Failed to sync item ${item.product_id}: ${error.error || "Unknown error"}`);
        }
      } else {
        // Item only in localStorage - add it
        const response = await fetch(`${API_BASE_URL}/api/cart/add/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: item.product_id,
            quantity: item.quantity,
          }),
        });
        
        if (!response.ok) {
          const error = await response.json();
          syncErrors.push(`Failed to sync item ${item.product_id}: ${error.error || "Unknown error"}`);
        }
      }
    } catch (error) {
      console.error(`Failed to sync item ${item.product_id}:`, error);
      syncErrors.push(`Failed to sync item ${item.product_id}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  // Clear localStorage after merge attempt - items are now in database cart
  // Even if some items failed, we clear localStorage since the merge attempt was made
  clearLocalStorageCart();
  
  if (syncErrors.length > 0) {
    console.warn("Some cart items failed to sync:", syncErrors);
  }

  // Return updated database cart
  return getCart();
}

export type CheckoutResponse = {
  session_id: string;
  url: string;
};

export async function createCheckoutSession(giftWrap: boolean, note: string): Promise<CheckoutResponse> {
  const token = getToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/api/payments/checkout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      gift_wrap: giftWrap,
      note: note,
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid - clear it and throw auth error
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
      }
      throw new Error("Your session has expired. Please sign in again.");
    }
    const error = await response.json();
    throw new Error(error.error || error.detail || "Failed to create checkout session");
  }

  return response.json();
}
