"use client";

import { useProductDetailPage } from "@/hooks/useProductDetailPage";
import ProductDetail from "../_components/ProductDetail";

export default function ProductDetailPage() {
  const { product, isLoading } = useProductDetailPage();

  if (isLoading || !product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
