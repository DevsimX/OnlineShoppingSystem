"use client";

import Link from "next/link";
import { ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Hot from "@/assets/hot.svg";
import New from "@/assets/new.svg";
import Stars from "@/assets/stars.svg";
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
  const contentRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [transformSteps, setTransformSteps] = useState<number[]>([0]);
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const calculateTransformSteps = () => {
      const containerWidth = container.clientWidth;
      const contentWidth = content.scrollWidth;
      // Account for right padding (24px = 1.5rem = pr-6) so it's visible at the end
      const rightPadding = 24;
      const maxScroll = contentWidth - containerWidth + rightPadding;

      if (maxScroll <= 0) {
        setTransformSteps([0]);
        return;
      }

      // Calculate target number of steps based on screen width
      // Large screens (>= 1280px): 4 steps
      // Medium screens (1024px-1279px): 5 steps
      // Smaller screens (768px-1023px): 6 steps
      // Below 768px: buttons are hidden, but we'll still calculate
      const screenWidth = window.innerWidth;
      let targetSteps = 4; // Default for large screens

      if (screenWidth >= 1280) {
        targetSteps = 4;
      } else if (screenWidth >= 1024) {
        targetSteps = 5;
      } else if (screenWidth >= 768) {
        targetSteps = 6;
      } else {
        // Below md, buttons are hidden, but calculate anyway
        targetSteps = 6;
      }

      // Calculate step size to evenly distribute across scrollable area
      const stepSize = maxScroll / targetSteps;

      const steps: number[] = [0];
      for (let i = 1; i <= targetSteps; i++) {
        const stepPosition = Math.round(stepSize * i);
        if (stepPosition < maxScroll) {
          steps.push(stepPosition);
        }
      }

      // Ensure max scroll is included as final step
      if (steps[steps.length - 1] < maxScroll) {
        steps.push(maxScroll);
      }

      setTransformSteps(steps);
    };

    const checkScroll = () => {
      const containerWidth = container.clientWidth;
      const contentWidth = content.scrollWidth;
      const rightPadding = 24;
      const maxScroll = contentWidth - containerWidth + rightPadding;
      const currentTranslate = Math.abs(translateX);
      
      setCanScrollRight(currentTranslate < maxScroll - 10);
      setCanScrollLeft(currentTranslate > 10);
    };

    const handleWheel = (e: WheelEvent) => {
      // Use deltaX for horizontal touchpad scrolling
      if (e.deltaX !== 0) {
        e.preventDefault();
        const containerWidth = container.clientWidth;
        const contentWidth = content.scrollWidth;
        const rightPadding = 24;
        const maxScroll = contentWidth - containerWidth + rightPadding;
        
        const newTranslateX = Math.max(
          -maxScroll,
          Math.min(0, translateX - e.deltaX)
        );
        setTranslateX(newTranslateX);
      }
    };

    const handleResize = () => {
      // Wait for layout to settle
      setTimeout(() => {
        calculateTransformSteps();
        checkScroll();
        // Reset position if content is smaller than container
        const containerWidth = container.clientWidth;
        const contentWidth = content.scrollWidth;
        const rightPadding = 24;
        if (contentWidth <= containerWidth) {
          setTranslateX(0);
        } else {
          // Clamp current position
          const maxScroll = contentWidth - containerWidth + rightPadding;
          setTranslateX(Math.max(-maxScroll, Math.min(0, translateX)));
        }
      }, 100);
    };

    // Wait for images to load and layout to settle
    const init = () => {
      setTimeout(() => {
        calculateTransformSteps();
        checkScroll();
      }, 100);
    };

    init();

    container.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", handleResize);

    // Recalculate when images load
    const images = content.querySelectorAll('img');
    images.forEach(img => {
      if (!img.complete) {
        img.addEventListener('load', init);
      }
    });

    // Update scroll state when translateX changes
    checkScroll();

    return () => {
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
      images.forEach(img => {
        img.removeEventListener('load', init);
      });
    };
  }, [products, translateX]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    const content = contentRef.current;
    if (!container || !content || transformSteps.length === 0) return;

    const containerWidth = container.clientWidth;
    const contentWidth = content.scrollWidth;
    const rightPadding = 24;
    const maxScroll = contentWidth - containerWidth + rightPadding;
    const currentTranslate = Math.abs(translateX);
    let targetTranslate = currentTranslate;

    if (direction === "right") {
      // Find the next step position
      for (let i = 0; i < transformSteps.length; i++) {
        const stepPos = transformSteps[i];
        if (stepPos > currentTranslate + 10) {
          targetTranslate = stepPos;
          break;
        }
      }
      // If at the end, scroll to max
      if (targetTranslate === currentTranslate) {
        targetTranslate = maxScroll;
      }
    } else {
      // Find the previous step position
      for (let i = transformSteps.length - 1; i >= 0; i--) {
        const stepPos = transformSteps[i];
        if (stepPos < currentTranslate - 10) {
          targetTranslate = stepPos;
          break;
        }
      }
      // If at the start, scroll to 0
      if (targetTranslate === currentTranslate) {
        targetTranslate = 0;
      }
    }

    setTranslateX(-targetTranslate);
  };

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
              <div key={product.href} className={`flex-shrink-0 skeletonSlide svelte-1h7r9oe ${index === products.length - 1 ? "mr-6" : ""}`}>
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
                        {product.badge === "new" ? <New /> : (product.badge === "hot" ? <Hot /> : null)}
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
