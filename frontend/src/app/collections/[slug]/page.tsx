"use client";

import Link from "next/link";
import Image from "next/image";
import { ListFilter } from "lucide-react";
import { useCollections } from "@/hooks/useCollections";
import { useCollectionsPagination } from "@/hooks/useCollectionsPagination";
import SortDropdown from "@/components/collections/SortDropdown";
import Hot from "@/assets/hot.svg";
import New from "@/assets/new.svg";

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
        {isLoading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 20 }).map((_, index) => (
              <div
                key={index}
                className="skeleton-card w-full rounded-3xl border-2 border-transparent min-h-[400px] sm:min-h-[300px]"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-xl">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.href}
                href={product.href}
                className="group relative flex w-full cursor-pointer flex-col text-left"
              >
                <div className="relative rounded-3xl border-2 border-transparent transition-all group-hover:border-black">
                  {product.imageUrl ? (
                    <Image
                      width={300}
                      height={300}
                      loading="lazy"
                      className="aspect-square h-full w-full rounded-2xl object-cover sm:rounded-[22px]"
                      src={product.imageUrl}
                      alt={product.imageAlt}
                      unoptimized
                    />
                  ) : (
                    <div className="aspect-square w-full rounded-2xl bg-gray-200 sm:rounded-[22px]" />
                  )}

                  {/* Sparkle decorations on hover */}
                  <div className="pointer-events-none absolute -top-2 -right-1.5 z-[2] hidden w-[75px] group-hover:block svelte-1cm5u1n">
                    <svg
                      width="80"
                      height="80"
                      viewBox="0 0 160 160"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="sparkle-animation svelte-1cm5u1n"
                    >
                      <g id="sparkles">
                        <path
                          id="Vector"
                          d="M119.016 5.11628e-06C117.426 35.6198 115.493 37.6609 80 40.9844C115.62 42.5739 117.661 44.5067 120.984 80C122.574 44.3802 124.507 42.3391 160 39.0156C124.38 37.4261 122.339 35.4933 119.016 5.11628e-06Z"
                          fill="white"
                        />
                        <path
                          id="Vector_2"
                          d="M39.0156 80C37.4261 115.62 35.4933 117.661 5.11628e-06 120.984C35.6198 122.574 37.6609 124.507 40.9844 160C42.5739 124.38 44.5067 122.339 80 119.016C44.3802 117.426 42.3391 115.493 39.0156 80Z"
                          fill="white"
                        />
                      </g>
                    </svg>
                  </div>
                  <div className="pointer-events-none absolute -bottom-2 -left-2 z-[2] hidden w-[75px] group-hover:block svelte-1cm5u1n">
                    <svg
                      width="80"
                      height="80"
                      viewBox="0 0 160 160"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="sparkle-animation svelte-1cm5u1n"
                    >
                      <g id="sparkles">
                        <path
                          id="Vector"
                          d="M119.016 5.11628e-06C117.426 35.6198 115.493 37.6609 80 40.9844C115.62 42.5739 117.661 44.5067 120.984 80C122.574 44.3802 124.507 42.3391 160 39.0156C124.38 37.4261 122.339 35.4933 119.016 5.11628e-06Z"
                          fill="white"
                        />
                        <path
                          id="Vector_2"
                          d="M39.0156 80C37.4261 115.62 35.4933 117.661 5.11628e-06 120.984C35.6198 122.574 37.6609 124.507 40.9844 160C42.5739 124.38 44.5067 122.339 80 119.016C44.3802 117.426 42.3391 115.493 39.0156 80Z"
                          fill="white"
                        />
                      </g>
                    </svg>
                  </div>

                  {/* Badges */}
                  {((product.badge === "new" || product.badge === "both" || product.new) ||
                    (product.badge === "hot" || product.badge === "both" || product.hot)) && (
                    <div className="pointer-events-none absolute -top-4 -left-3 z-[2] sm:-top-5 flex">
                      {(product.badge === "new" || product.badge === "both" || product.new) && <New />}
                      {(product.badge === "hot" || product.badge === "both" || product.hot) && (
                        <div
                          className={`${
                            (product.badge === "new" || product.badge === "both" || product.new) &&
                            (product.badge === "hot" || product.badge === "both" || product.hot)
                              ? "-ml-8 z-[5]"
                              : ""
                          }`}
                        >
                          <Hot />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-4 sm:pt-6">
                  <div className="flex justify-between gap-2 max-sm:flex-col sm:gap-4">
                    <div className="flex flex-col">
                      <h3 className="font-price-check text-xl leading-[85%] font-normal wrap-anywhere text-black font-stretch-expanded sm:text-2xl">
                        {product.name}
                      </h3>
                      {product.vendor && (
                        <span className="pt-2 text-sm leading-tight tracking-wide text-black sm:text-lg">
                          {product.vendor}
                        </span>
                      )}
                    </div>
                    {product.price && product.price.trim() !== "" && (
                      <div>
                        <div className="flex flex-col gap-1">
                          <span className="flex font-reika-script text-[32px] leading-none text-black sm:text-right">
                            <span className="text-[20px] leading-none">$</span>{" "}
                            {(() => {
                              const priceStr = product.price.toString();
                              const [whole, decimal = ""] = priceStr.split(".");
                              const decimalFormatted = decimal.padEnd(2, "0").slice(0, 2);
                              return (
                                <>
                                  {whole}
                                  <span className="text-[20px] leading-none">.{decimalFormatted}</span>
                                </>
                              );
                            })()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {(hasNext || hasPrevious) && (
          <div className="flex w-full items-center gap-6">
            <div className="flex gap-2">
              {hasPrevious && (
                <button
                  onClick={() => handlePrevious(hasPrevious)}
                  className="flex items-center justify-center uppercase tracking-wide font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-pop-red-accent text-white hover:bg-pop-teal-mid border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-12 px-6 py-2 text-lg md:text-xl rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                    className="h-5 w-5 mr-2 rotate-180"
                  >
                    <path
                      d="M3.33337 10.5H16.6667M16.6667 10.5L11.6667 5.5M16.6667 10.5L11.6667 15.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Previous
                </button>
              )}
            </div>
            <div className="ml-auto">
              {hasNext && (
                <button
                  onClick={() => handleNext(hasNext)}
                  className="flex items-center justify-center uppercase tracking-wide font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-pop-red-accent text-white hover:bg-pop-teal-mid border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-12 px-6 py-2 text-lg md:text-xl rounded-full"
                >
                  Next
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                    className="h-5 w-5 ml-2"
                  >
                    <path
                      d="M3.33337 10.5H16.6667M16.6667 10.5L11.6667 5.5M16.6667 10.5L11.6667 15.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
