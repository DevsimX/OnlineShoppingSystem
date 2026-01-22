"use client";

import { ListFilter } from "lucide-react";
import { useCollections } from "@/hooks/useCollections";
import { useCollectionsPagination } from "@/hooks/useCollectionsPagination";
import SortDropdown from "@/components/collections/SortDropdown";
import CollectionProductGrid from "@/components/common/CollectionProductGrid";
import Pagination from "@/components/common/Pagination";

export default function CollectionsPage() {
  const { slug, currentPage, pageSize, sort, handleNextPage: handleNext, handlePreviousPage: handlePrevious, handleSortChange } =
    useCollectionsPagination();

  const {
    products,
    isLoading,
    totalCount,
    hasNext,
    hasPrevious,
    pageTitle,
  } = useCollections(slug, currentPage, pageSize, sort);

  return (
    <section className="px-6 py-12 md:py-20">
      <h1 className="font-price-check text-3xl font-stretch-expanded md:text-[56px] lg:text-[64px]">
        {pageTitle}
      </h1>

      <div className="mt-6 space-y-4 border-t-2 border-dashed pt-6 sm:mt-10 sm:pt-10">
        <div className="flex items-center gap-3 max-sm:gap-y-6 sm:gap-6">
          {/* Filter Button */}
          <button
            className="flex h-12 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-white px-4 font-black tracking-wide text-black uppercase shadow-[2px_2px_0px_0px_#000] hover:bg-pop-teal-mid hover:text-white disabled:cursor-not-allowed disabled:bg-gray-400 sm:px-6 sm:text-lg"
            aria-haspopup="dialog"
            aria-expanded="false"
          >
            <ListFilter className="mr-2 h-5 w-5" />
            Filters
          </button>

          {/* Product Count - Desktop */}
          <div className="max-md:hidden">
            <span className="text-lg">
              Showing <span className="font-semibold">{products.length}</span> of{" "}
              <span className="font-semibold">{totalCount}</span> products
            </span>
          </div>

          {/* Sort Dropdown */}
          <SortDropdown value={sort} onChange={handleSortChange} />
        </div>

        {/* Product Count - Mobile */}
        <div className="md:hidden">
          <span className="text-lg">
            Showing <span className="font-semibold">{products.length}</span> of{" "}
            <span className="font-semibold">{totalCount}</span> products
          </span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mt-6 space-y-10 sm:mt-10">
        <CollectionProductGrid products={products} isLoading={isLoading} />

        {/* Pagination */}
        {(hasNext || hasPrevious) && (
          <Pagination
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            currentPage={currentPage}
            onNext={() => handleNext(hasNext)}
            onPrevious={() => handlePrevious(hasPrevious)}
          />
        )}
      </div>
    </section>
  );
}
