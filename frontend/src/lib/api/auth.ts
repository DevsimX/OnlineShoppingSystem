const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost";

export type RegisterData = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
  password_confirm: string;
};

export type LoginData = {
  username: string;
  password: string;
};

export type RegisterResponse = {
  message: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    phone: string;
    date_joined: string;
  };
};

export type ApiError = {
  error?: string;
  [key: string]: string | string[] | undefined;
};

export async function register(data: RegisterData): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result as RegisterResponse;
}

export async function login(data: LoginData): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result as LoginResponse;
}

export async function logout(refreshToken: string): Promise<void> {
  const token = getToken();
  if (!token) return;

  try {
    await fetch(`${API_BASE_URL}/api/auth/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    clearToken();
    clearRefreshToken();
  }
}

export async function getCurrentUser(): Promise<LoginResponse["user"]> {
  const token = getToken();
  if (!token) {
    throw new Error("No token available");
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result as LoginResponse["user"];
}

// Token management
export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

export function clearToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
}

export function setRefreshToken(refreshToken: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("refresh_token", refreshToken);
  }
}

export function getRefreshToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refresh_token");
  }
  return null;
}

export function clearRefreshToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("refresh_token");
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

// Phone validation for Australian format
export function validateAustralianPhone(phone: string): boolean {
  // Australian phone number pattern: +61XXXXXXXXX or 0XXXXXXXXX
  const pattern = /^(\+61|0)[2-478](?:[ -]?[0-9]){8}$/;
  return pattern.test(phone);
}

// Update user profile
export async function updateProfile(data: {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
}): Promise<LoginResponse["user"]> {
  const token = getToken();
  if (!token) {
    throw new Error("No token available");
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/me/update/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result as LoginResponse["user"];
}

// Postal address types
export type PostalAddress = {
  id?: number;
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  province: string;
  country: string;
  postal_code: string;
  phone?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
};

// Get postal addresses
export async function getPostalAddresses(): Promise<PostalAddress[]> {
  const token = getToken();
  if (!token) {
    throw new Error("No token available");
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/postal-addresses/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result as PostalAddress[];
}

// Create postal address
export async function createPostalAddress(data: Omit<PostalAddress, "id" | "created_at" | "updated_at">): Promise<PostalAddress> {
  const token = getToken();
  if (!token) {
    throw new Error("No token available");
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/postal-addresses/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result as PostalAddress;
}

// Update postal address
export async function updatePostalAddress(addressId: number, data: Partial<PostalAddress>): Promise<PostalAddress> {
  const token = getToken();
  if (!token) {
    throw new Error("No token available");
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/postal-addresses/${addressId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result as PostalAddress;
}
