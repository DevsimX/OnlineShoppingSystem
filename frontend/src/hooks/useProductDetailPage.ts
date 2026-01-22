import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { getProductDetail, type ProductDetail as ProductDetailType } from "@/lib/api/products";

export function useProductDetailPage() {
  const params = useParams();
  const productId = params?.product_id as string;
  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const productIdNum = parseInt(productId, 10);
        if (isNaN(productIdNum)) {
          setError("Invalid product ID");
          return;
        }
        const data = await getProductDetail(productIdNum);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Product not found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (error || (!isLoading && !product)) {
    notFound();
  }

  return {
    product,
    isLoading,
    error,
  };
}
