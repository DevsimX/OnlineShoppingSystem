import { type Product } from "@/lib/api/products";
import ProductCard from "./ProductCard";
import LoadingSkeleton from "./LoadingSkeleton";

type ProductGridProps = {
  products: Product[];
  isLoading: boolean;
  getProductHref: (product: Product) => string;
  showBrand?: boolean;
  emptyMessage?: string;
};

export default function ProductGrid({
  products,
  isLoading,
  getProductHref,
  showBrand = true,
  emptyMessage = "No products found",
}: ProductGridProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-xl text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          href={getProductHref(product)}
          showBrand={showBrand}
        />
      ))}
    </div>
  );
}
