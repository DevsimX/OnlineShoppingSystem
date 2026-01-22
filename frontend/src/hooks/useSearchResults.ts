import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { searchProductsFull, type Product } from "@/lib/api/products";

export function useSearchResults() {
  const params = useParams();
  const searchParams = useSearchParams();
  const queryParam = (params.query as string) || "";
  const query = decodeURIComponent(queryParam);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 20;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  useEffect(() => {
    const decodedQuery = decodeURIComponent(query);
    if (!decodedQuery) {
      setIsLoading(false);
      setProducts([]);
      setTotalCount(0);
      return;
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const result = await searchProductsFull(decodedQuery, currentPage, pageSize);
        setProducts(result.results);
        setTotalCount(result.count);
        setHasNext(result.next !== null);
        setHasPrevious(result.previous !== null);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setProducts([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [query, currentPage]);

  return {
    query,
    products,
    isLoading,
    totalCount,
    hasNext,
    hasPrevious,
    currentPage,
  };
}
