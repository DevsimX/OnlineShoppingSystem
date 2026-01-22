import { type ProductCarouselProduct } from "@/hooks/useCollections";
import CollectionProductCard from "./CollectionProductCard";
import LoadingSkeleton from "./LoadingSkeleton";

type CollectionProductGridProps = {
  products: ProductCarouselProduct[];
  isLoading: boolean;
  emptyMessage?: string;
};

export default function CollectionProductGrid({
  products,
  isLoading,
  emptyMessage = "No products found",
}: CollectionProductGridProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-xl">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <CollectionProductCard key={product.href} product={product} />
      ))}
    </div>
  );
}
