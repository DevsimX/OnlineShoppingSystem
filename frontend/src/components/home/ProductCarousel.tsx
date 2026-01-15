"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

type Product = {
  name: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
  vendor?: string;
  price: string;
  badge?: "new" | "hot";
};

type ProductCarouselProps = {
  title: string;
  titleHref?: string;
  products: Product[];
  showSeeAll?: boolean;
};

export default function ProductCarousel({ title, titleHref, products, showSeeAll = true }: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    checkScroll();
    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = 300;
    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const TitleComponent = titleHref ? (
    <Link href={titleHref} className="flex items-center gap-2 font-reika-script">
      {title}
      <ArrowRight className="w-6 h-6 sm:hidden" />
    </Link>
  ) : (
    <>{title}</>
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
        <div className="overflow-hidden pt-2">
          <div
            ref={scrollContainerRef}
            className="flex gap-2 sm:gap-5 pl-6 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product, index) => (
              <div key={product.href} className={`flex-shrink-0 ${index === products.length - 1 ? "mr-6" : ""}`}>
                <Link href={product.href} className="group relative flex w-full cursor-pointer flex-col text-left">
                  <div className="relative rounded-3xl border-2 border-transparent transition-all group-hover:border-black">
                    <img
                      width="300"
                      height="300"
                      loading="lazy"
                      className="aspect-square h-full w-full rounded-2xl object-cover sm:rounded-[22px]"
                      src={product.imageUrl}
                      alt={product.imageAlt}
                    />
                    {product.badge && (
                      <div className="pointer-events-none absolute -top-4 -left-3 z-[2] sm:-top-5">
                        <svg
                          viewBox="0 0 85 76"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-16 sm:size-[90px]"
                        >
                          <g clipPath="url(#clip0_3012_3121)">
                            <path
                              d="M26.9299 -0.128031C30.5635 13.4122 48.7506 15.8067 55.7652 3.66815C48.7599 15.812 59.9272 30.3653 73.4702 26.742C59.93 30.3756 57.5354 48.5627 69.6741 55.5772C57.53 48.572 42.9768 59.7393 46.6002 73.2823C42.9665 59.7421 24.7793 57.3476 17.7651 69.4862C24.77 57.3422 13.6029 42.7889 0.0598551 46.4123C13.6001 42.7786 15.9945 24.5915 3.85606 17.5771C15.9999 24.5822 30.5532 13.415 26.9299 -0.128031Z"
                              fill="#FBD576"
                            />
                            <path
                              d="M20.2788 42.8167C18.3276 43.3396 17.0583 42.0025 16.6494 40.4764C16.1214 38.5059 16.9797 34.4454 21.8093 33.1513C24.1662 32.5197 25.8657 33.7622 26.751 35.0572C27.0246 35.4601 27.7709 36.8545 28.3454 37.8393C28.4603 38.0363 28.6049 38.2668 28.8753 38.1943C29.0492 38.1477 29.1378 37.9376 29.0705 37.6865C29.0705 37.6865 28.8245 36.6136 28.7484 34.3978C28.7269 33.6995 28.5953 31.3537 30.9908 30.7118C32.4397 30.3236 33.2691 31.178 33.4658 31.9121C33.7194 32.8587 33.4245 32.9171 33.2275 33.032C32.1102 33.8076 32.1797 35.9216 32.1797 35.9216L32.2535 39.4425C32.286 40.8003 32.7363 41.3216 33.4511 41.13C34.1659 40.9385 34.4894 39.9822 34.5117 39.2929C34.5265 38.7299 34.6138 38.4373 35.1547 38.2924C35.4638 38.2096 35.9236 38.1485 36.1203 38.8826C36.2756 39.4621 36.0122 41.1063 35.7335 41.8436C35.1931 43.4585 34.3874 45.1652 32.4169 45.6932C30.3884 46.2367 29.3789 44.4781 28.2219 42.3241C28.0567 42.0164 26.9798 40.0066 26.9746 39.9873C26.8739 39.7658 26.7269 39.681 26.5917 39.7172C26.4178 39.7638 26.333 39.9108 26.3409 40.095L26.5757 42.5168C26.6548 44.0485 26.4861 47.2823 22.9894 48.2193C21.4826 48.623 20.1112 48.1415 19.7178 46.6733C19.3348 45.2438 20.1247 44.3281 20.2986 44.2815C20.627 44.1935 20.9213 44.6737 21.7713 44.446C22.6407 44.213 23.1794 43.3647 23.1666 42.3121C23.1666 42.3121 23.0592 37.6614 23.0668 37.5352C23.0957 36.9477 22.7128 36.6776 22.1719 36.8225C21.2832 37.0606 20.4443 37.948 20.7601 39.1264C20.8377 39.4162 21.053 39.5242 21.2655 39.4672C21.4587 39.4155 21.487 39.3665 21.5836 39.3406C21.8347 39.2733 22.1983 39.5486 22.3277 40.0315C22.6331 41.1713 21.9015 42.3819 20.2788 42.8167ZM40.7202 42.9921C37.2236 43.929 35.2129 42.0659 34.6124 39.825C33.6599 36.2704 35.6482 33.3358 37.9664 32.7146C40.3039 32.0883 41.4215 33.6316 41.701 34.6748C42.1876 36.4908 41.3787 37.7221 40.291 38.5312C39.3952 39.206 38.4868 39.1388 38.4344 39.4842C38.3334 40.1117 39.696 39.788 39.8699 39.7414C42.2654 39.0995 42.9387 37.594 43.118 36.7177C43.2166 36.2357 43.4226 36.077 43.8089 35.9735C44.176 35.8752 44.7866 35.8358 44.8295 37.2323C44.8509 37.9305 45.1055 41.817 40.7202 42.9921ZM38.3264 35.372C37.3026 35.6463 37.2558 37.481 37.9889 37.5123C38.5326 37.5322 39.2245 36.56 39.0175 35.7873C38.9295 35.4589 38.7321 35.2633 38.3264 35.372ZM43.1482 39.2771C42.7341 37.7316 43.3942 36.0225 42.9335 34.3032C42.7782 33.7236 42.4225 33.6326 42.2672 33.053C42.1585 32.6473 42.4741 31.5068 44.1162 31.0668C45.2946 30.751 45.8645 31.1781 46.0043 31.6997C46.3149 32.8588 45.7556 35.9488 46.0092 36.8954C46.1335 37.3591 46.4495 37.6885 46.9711 37.5488C48.1302 37.2382 48.0271 33.9943 47.7631 33.0091C47.6078 32.4295 47.2522 32.3385 47.0969 31.7589C46.9882 31.3532 47.323 30.2075 48.9458 29.7727C50.1242 29.4569 50.6611 30.2241 50.8319 30.8617C51.1425 32.0208 50.6153 34.9987 50.8068 35.7135C50.9362 36.1964 51.2791 36.3944 51.7041 36.2805C53.0178 35.9286 52.9959 33.7603 52.8388 32.7879C51.9108 32.4154 51.6044 31.5036 51.5112 31.1559C51.4336 30.8661 51.2447 29.1567 53.1572 28.6443C55.3016 28.0697 55.9476 30.7125 56.0408 31.0603C56.6723 33.4171 55.7962 38.7247 51.8166 39.7911C50.6574 40.1016 49.7573 39.3697 49.4475 38.8315C49.3919 38.7015 49.3274 38.6152 49.2115 38.6463C49.1149 38.6722 49.0173 38.9261 49.0173 38.9261C48.5406 40.0063 47.9529 40.8263 46.4846 41.2197C44.6687 41.7063 43.526 40.6873 43.1482 39.2771Z"
                              fill="black"
                            />
                            <text
                              x="42.5"
                              y="48"
                              textAnchor="middle"
                              fill="black"
                              fontSize="10"
                              fontWeight="900"
                              fontFamily="trade-gothic-next, sans-serif"
                              style={{ textTransform: "uppercase" }}
                            >
                              {product.badge === "new" ? "NEW" : "HOT"}
                            </text>
                          </g>
                          <defs>
                            <clipPath id="clip0_3012_3121">
                              <rect width="78" height="78" fill="white" transform="translate(-11 9) rotate(-15)" />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 pt-4 sm:pt-6">
                    <div className="flex justify-between gap-2 max-sm:flex-col sm:gap-4">
                      <div className="flex flex-col">
                        <h3 className="text-xl leading-[85%] font-normal wrap-anywhere text-black font-stretch-expanded sm:text-2xl">
                          {product.name}
                        </h3>
                        {product.vendor && (
                          <span className="pt-2 text-sm leading-tight tracking-wide text-black sm:text-lg">{product.vendor}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex flex-col gap-1">
                          <span className="flex text-[32px] leading-none text-black sm:text-right">
                            <span className="text-[20px] leading-none">$</span> {product.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
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
