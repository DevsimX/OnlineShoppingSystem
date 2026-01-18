const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost";

export type Product = {
  id: number;
  name: string;
  company: string;
  price: string;
  profile_pic_link: string;
  new: boolean;
  hot: boolean;
};

export type ProductDetail = Product & {
  description: string;
  detail_pic_links: string[] | null;
  category: number;
  category_name: string;
  current_stock: number;
  status: string;
  gift_box: boolean;
  created_at: string;
  updated_at: string;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ApiError = {
  error?: string;
  [key: string]: string | string[] | undefined;
};

export async function getHotProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/api/products/hot/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result as Product[];
}

export async function getNewProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/api/products/new/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result as Product[];
}

export async function getExploreProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/api/products/explore/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result as Product[];
}

export async function getGiftBoxProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/api/products/gift-box/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result as Product[];
}

export async function getAllProducts(
  page = 1,
  pageSize = 20,
  sort?: string
): Promise<PaginatedResponse<Product>> {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });
  
  if (sort && sort !== "COLLECTION_DEFAULT") {
    params.append("sort", sort);
  }
  
  const response = await fetch(`${API_BASE_URL}/api/products/?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result as PaginatedResponse<Product>;
}

export async function getProductsByCategory(
  categoryName: string,
  page = 1,
  pageSize = 20,
  sort?: string
): Promise<PaginatedResponse<Product>> {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });
  
  if (sort && sort !== "COLLECTION_DEFAULT") {
    params.append("sort", sort);
  }
  
  const response = await fetch(
    `${API_BASE_URL}/api/products/category/${encodeURIComponent(categoryName)}/?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result as PaginatedResponse<Product>;
}

export async function getProductDetail(productId: number): Promise<ProductDetail> {
  const response = await fetch(`${API_BASE_URL}/api/products/${productId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result as ProductDetail;
}
