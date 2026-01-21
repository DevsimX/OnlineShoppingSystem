import { getToken } from "./auth";

export type Order = {
  id: number;
  date: string;
  total: string;
  status: string;
  shipping: string;
  created_at: string;
  updated_at: string;
};

export type PaginatedOrders = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost";

export async function getOrders(page: number = 1, pageSize: number = 10): Promise<PaginatedOrders> {
  const token = getToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/api/orders/?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || errorData.detail || `Failed to fetch orders: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function getOrderDetail(orderId: number): Promise<Order> {
  const token = getToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch order details");
  }

  return response.json();
}
