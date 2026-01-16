"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";

type TimelineItem = {
  year: string;
  title: string;
  description: string;
  backgroundColor: "pop-green-mid" | "pop-red-mid" | "pop-blue-mid" | "pop-teal-mid";
};

type TimelineCarouselProps = {
  title: string;
  items: TimelineItem[];
};

export default function TimelineCarousel({ title, items }: TimelineCarouselProps) {
  const { scrollContainerRef, contentRef, translateX, canScrollRight, canScrollLeft, scroll } = useHorizontalScroll({
    enableOverscroll: false,
    dependencies: [items],
  });

  const getBackgroundColor = (color: TimelineItem["backgroundColor"]) => {
    switch (color) {
      case "pop-green-mid":
        return "bg-[var(--pop-green-mid)]";
      case "pop-red-mid":
        return "bg-[var(--pop-red-mid)]";
      case "pop-blue-mid":
        return "bg-[var(--pop-blue-mid)]";
      case "pop-teal-mid":
        return "bg-[var(--pop-teal-mid)]";
      default:
        return "bg-[var(--pop-green-mid)]";
    }
  };

  return (
    <section className="pt-12 pb-6 md:pt-16 md:pb-10">
      <div className="flex flex-wrap justify-between px-6">
        <div>
          <h2 className="font-reika-script leading-tight text-4xl sm:text-[56px]">{title}</h2>
        </div>
      </div>
      <div className="relative overflow-hidden">
        <div className="embla overflow-hidden">
          <div ref={scrollContainerRef} className="embla__container relative svelte-1hy7a2v">
            <div
              ref={contentRef}
              className="flex gap-4 sm:gap-6 pl-6 pr-6"
              style={{
                transform: `translateX(${translateX}px)`,
                transition: "transform 0.3s ease-out",
                willChange: "transform",
              }}
            >
              {items.map((item, index) => (
                <div key={index} className="embla__slide py-6 svelte-1hy7a2v flex-shrink-0">
                  <div
                    className={`group relative flex w-full flex-col rounded-3xl border-2 ${getBackgroundColor(
                      item.backgroundColor
                    )} text-left svelte-1hy7a2v`}
                  >
                    <div className="relative rounded-3xl">
                      <div className="absolute top-4 left-4 size-4 rounded-full border-2 bg-[var(--pop-yellow-mid)] shadow-3d"></div>
                    </div>
                    <div className="space-y-3 p-10">
                      <div className="flex flex-col gap-4 text-[var(--pop-yellow-light)]">
                        <p className="font-reika-script text-3xl text-[var(--pop-yellow-mid)]">{item.year}</p>
                        <h3 className="font-price-check text-2xl leading-[85%] font-stretch-expanded lg:text-4xl">
                          {item.title}
                        </h3>
                        <p className="text-lg leading-[140%] md:text-xl">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute cursor-pointer z-[2] rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] w-12 h-12 p-2 justify-center items-center select-none top-1/2 -translate-y-1/2 hover:bg-[#30897c] hover:[&_path]:stroke-white transition-colors duration-200 flex items-center justify-center left-1.5"
            aria-label="Previous timeline cards"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="sr-only">Previous</span>
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute cursor-pointer z-[2] rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] w-12 h-12 p-2 justify-center items-center select-none top-1/2 -translate-y-1/2 hover:bg-[#30897c] hover:[&_path]:stroke-white transition-colors duration-200 flex items-center justify-center right-1.5"
            aria-label="Next timeline cards"
          >
            <ChevronRight className="w-6 h-6" />
            <span className="sr-only">Next</span>
          </button>
        )}
      </div>
    </section>
  );
}
