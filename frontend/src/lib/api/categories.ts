const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost";

export type Category = {
  id: number;
  name: string;
  href: string;
  imageUrl: string;
};

export type ApiError = {
  error?: string;
  [key: string]: string | string[] | undefined;
};

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/api/categories/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result as Category[];
}
