"use client";

import Link from "next/link";
import ProductCarousel from "@/components/home/ProductCarousel";
import { type ProductCarouselProduct } from "@/hooks/useProductDetail";

type MoreFromBrandProps = {
  products: ProductCarouselProduct[];
  isLoading: boolean;
  brand: string;
  categorySlug: string;
};

export default function MoreFromBrand({ products, isLoading, brand, categorySlug }: MoreFromBrandProps) {
  if (products.length === 0 && !isLoading) {
    return null;
  }

  return (
    <section className="border-b-2 py-12 md:py-16">
      <div className="flex flex-wrap justify-between px-6">
        <div>
          <h2 className="font-reika-script leading-none text-4xl md:text-[56px]">
            <Link href={`/collections/${categorySlug}`} className="flex items-center gap-2">
              More From
            </Link>
          </h2>
          <h2 className="font-price-check text-4xl leading-none font-stretch-expanded md:text-6xl">
            <Link href={`/collections/${categorySlug}`} className="flex items-center gap-2">
              {brand}
            </Link>
          </h2>
        </div>
        <div className="max-sm:hidden">
          <Link
            href={`/collections/${categorySlug}`}
            className="flex items-center justify-center uppercase tracking-wide font-trade-gothic font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none text-black hover:text-pop-red-accent min-h-12 px-6 py-2 text-lg md:text-xl rounded-full !px-0"
          >
            See all
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
          </Link>
        </div>
      </div>
      <ProductCarousel
        title=""
        products={products}
        showSeeAll={false}
        isLoading={isLoading}
      />
    </section>
  );
}
