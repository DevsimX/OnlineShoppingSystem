"use client";

import { useSearchResults } from "@/hooks/useSearchResults";
import ProductGrid from "@/components/common/ProductGrid";
import Pagination from "@/components/common/Pagination";
import { type Product } from "@/lib/api/products";
import Marquee from "@/components/home/Marquee";

export default function SearchResultsPage() {
  const { query, products, isLoading, totalCount, hasNext, hasPrevious, currentPage } = useSearchResults();

  const getProductHref = (product: Product) => `/products/${product.id}`;

  return (
    <>
    <section className="px-6 py-20">
      <div className="font-reika-script text-3xl leading-none lg:text-5xl">
        {isLoading ? "..." : totalCount > 0 ? `${totalCount} ` : ""}Results for
      </div>
      <div className="font-price-check text-3xl leading-none font-stretch-expanded lg:text-5xl">
        {query}
      </div>

      <div className="mt-10 space-y-4 border-t-2 border-dashed pt-10">
        <ProductGrid
          products={products}
          isLoading={isLoading}
          getProductHref={getProductHref}
          emptyMessage={totalCount === 0 ? `No products found for "${query}".` : "No products found"}
        />
        {!isLoading && totalCount > 0 && (
          <div className="mt-10 pt-6">
            <Pagination
              hasNext={hasNext}
              hasPrevious={hasPrevious}
              currentPage={currentPage}
              baseUrl={`/search/${encodeURIComponent(query)}`}
            />
          </div>
        )}
      </div>
    </section>
    <Marquee />
    </>
  );
}
