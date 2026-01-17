"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";
import Hot from "@/assets/hot.svg";
import New from "@/assets/new.svg";
import Stars from "@/assets/stars.svg";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";

type Product = {
  name: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
  vendor?: string;
  price: string;
  badge?: "new" | "hot" | "both";
  new?: boolean;
  hot?: boolean;
};

type ProductCarouselProps = {
  title: string;
  titleHref?: string;
  products: Product[];
  showSeeAll?: boolean;
  isLoading?: boolean;
};

export default function ProductCarousel({ title, titleHref, products, showSeeAll = true, isLoading = false }: ProductCarouselProps) {
  const { scrollContainerRef, contentRef, translateX, canScrollRight, canScrollLeft, scroll } =
    useHorizontalScroll({
      dependencies: [products],
    });

  const TitleComponent = titleHref ? (
    <Link href={titleHref} className="flex items-center gap-2 font-reika-script">
      {title}
    </Link>
  ) : (
    <span className="flex items-center gap-2 font-reika-script">{title}</span>
  );

  return (
    <section className="not-prose py-12 md:py-16">
      <div className="flex flex-wrap justify-between px-6">
        <h2 className="leading-tight text-4xl md:text-[56px]">{TitleComponent}</h2>
        {showSeeAll && titleHref && (
          <div className="max-sm:hidden">
            <Link
              href={titleHref}
              className="flex items-center justify-center uppercase tracking-wide font-ultra-bold disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none text-black hover:text-[var(--pop-red-accent)] min-h-12 px-6 py-2 text-lg md:text-xl rounded-full !px-0"
            >
              See All
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        )}
      </div>
      <div className="relative mt-5 overflow-hidden">
        <div className="pt-2 overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="embla__container relative svelte-1h7r9oe"
          >
            <div
              ref={contentRef}
              className="flex gap-4 sm:gap-6 pl-6 pr-6"
              style={{
                transform: `translateX(${translateX}px)`,
                transition: "transform 0.3s ease-out",
                willChange: "transform",
              }}
            >
            {products.map((product, index) => (
              <div key={product.href || index} className={`flex-shrink-0 skeletonSlide svelte-1h7r9oe ${index === products.length - 1 ? "mr-6" : ""}`}>
                {isLoading ? (
                  <div className="skeleton-card w-full rounded-3xl border-2 border-transparent min-h-[400px] sm:min-h-[300px]"></div>
                ) : (
                  <Link href={product.href || "#"} className="group relative flex w-full cursor-pointer flex-col text-left">
                    <div className="relative rounded-3xl border-2 border-transparent transition-all group-hover:border-black">
                      <Image
                        width={300}
                        height={300}
                        className="aspect-square h-full w-full rounded-2xl object-cover sm:rounded-[22px]"
                        src={product.imageUrl || ""}
                        alt={product.imageAlt || ""}
                        unoptimized
                      />
                      {((product.badge === "new" || product.badge === "both" || product.new) || (product.badge === "hot" || product.badge === "both" || product.hot)) && (
                        <div className="pointer-events-none absolute -top-4 -left-3 z-[2] sm:-top-5 flex">
                          {(product.badge === "new" || product.badge === "both" || product.new) && <New />}
                          {(product.badge === "hot" || product.badge === "both" || product.hot) && (
                            <div className={`${((product.badge === "new" || product.badge === "both" || product.new) && (product.badge === "hot" || product.badge === "both" || product.hot)) ? "-ml-8 z-[5]" : ""}`}>
                              <Hot />
                            </div>
                          )}
                        </div>
                      )}
                      <div className="pointer-events-none absolute -top-2 -right-1.5 z-[2] hidden w-[75px] group-hover:block  svelte-1cm5u1n">
                        <Stars />
                      </div>
                      <div className="pointer-events-none absolute -bottom-2 -left-2 z-[2] hidden w-[75px] group-hover:block  svelte-1cm5u1n">
                        <Stars />
                      </div>
                    </div>
                    <div className="space-y-3 pt-4 sm:pt-6">
                      <div className="flex justify-between gap-2 max-sm:flex-col sm:gap-4">
                        <div className="flex flex-col">
                          <h3 className="text-xl leading-[85%] font-normal wrap-anywhere text-black font-price-check font-stretch-expanded sm:text-2xl">
                            {product.name}
                          </h3>
                          {product.vendor && (
                            <span className="pt-2 text-sm leading-tight tracking-wide text-black sm:text-lg">{product.vendor}</span>
                          )}
                        </div>
                        {product.price && product.price.trim() !== "" && (
                          <div>
                            <div className="flex flex-col gap-1">
                              <span className="flex text-[32px] leading-none text-black sm:text-right font-reika-script">
                                <span className="text-[20px] leading-none">$</span>{" "}
                                {(() => {
                                  const priceStr = product.price.toString();
                                  const [whole, decimal = ""] = priceStr.split(".");
                                  // Pad decimal to always be 2 digits
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
                )}
              </div>
            ))}
            </div>
          </div>
        </div>
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute cursor-pointer z-[2] rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] w-12 h-12 p-2 justify-center items-center select-none top-1/2 -translate-y-1/2 hover:bg-[#30897c] hover:[&_path]:stroke-white transition-colors duration-200 flex items-center justify-center left-1.5"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="sr-only">Previous</span>
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute cursor-pointer z-[2] rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] w-12 h-12 p-2 justify-center items-center select-none top-1/2 -translate-y-1/2 hover:bg-[#30897c] hover:[&_path]:stroke-white transition-colors duration-200 flex items-center justify-center right-1.5"
            aria-label="Next products"
          >
            <ChevronRight className="w-6 h-6" />
            <span className="sr-only">Next</span>
          </button>
        )}
      </div>
    </section>
  );
}
