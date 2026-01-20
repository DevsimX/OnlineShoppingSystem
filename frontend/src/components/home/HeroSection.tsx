"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

type HeroSlide = {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  ctaText: string;
  ctaHref: string;
};

const heroSlides: HeroSlide[] = [
  {
    title: "Summer Love",
    subtitle: "Classic Summer Favourites Available Now!",
    description: "",
    imageUrl: "/images/image01.png",
    imageAlt: "Classic Summer Favourites Available Now!",
    ctaText: "Shop Food & Drinks",
    ctaHref: "/collections/food-drinks",
  },
  {
    title: "Sweet Treats",
    subtitle: "Tasty Local-Made Chocolates & Candy!",
    description: "",
    imageUrl: "/images/image02.png",
    imageAlt: "Tasty Local-Made Chocolates & Candy!",
    ctaText: "Shop Confectionary",
    ctaHref: "/collections/confectionary",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = heroSlides[currentSlide];

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative overflow-hidden md:px-6 md:py-10">
      <div className="relative overflow-hidden md:rounded-4xl md:border-2 md:border-black bg-[var(--pop-red-accent)] hero-shadow-3d">
        <div className="grid h-full min-h-[500px] items-center md:grid-cols-2 md:min-h-[600px]">
          <div className="relative flex h-full flex-col items-center justify-center space-y-2 px-6 pt-6 pb-12 text-center md:p-12 lg:space-y-8">
            <p className="text-4xl text-[var(--pop-yellow-mid)] font-reika-script">{slide.title}</p>
            <h1 className="text-4xl leading-[0.9] text-[var(--pop-yellow-light)] font-stretch-expanded lg:text-6xl font-price-check">
              {slide.subtitle}
            </h1>
            <div className="flex justify-center pt-4">
              <Link
                href={slide.ctaHref}
                className="flex items-center justify-center uppercase tracking-wide font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-white text-black hover:bg-[var(--pop-teal-mid)] hover:text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-14 px-8 py-2 text-lg md:text-xl rounded-full"
              >
                {slide.ctaText}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 md:bottom-12">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-4 w-4 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                    index === currentSlide ? "bg-[var(--pop-neutral-black)]" : "bg-white"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="relative order-first h-full md:order-none">
            <div className="h-full">
              <Image
                src={slide.imageUrl}
                alt={slide.imageAlt}
                width={400}
                height={300}
                className="!h-full !w-full object-cover object-center max-md:!h-72"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Arrows */}
      {heroSlides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute cursor-pointer z-[2] rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] w-12 h-12 p-2 justify-center items-center select-none top-1/2 -translate-y-1/2 hover:bg-[#30897c] hover:[&_path]:stroke-white transition-colors duration-200 flex items-center justify-center left-1.5 max-md:hidden"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="sr-only">Previous</span>
          </button>
          <button
            onClick={goToNext}
            className="absolute cursor-pointer z-[2] rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] w-12 h-12 p-2 justify-center items-center select-none top-1/2 -translate-y-1/2 hover:bg-[#30897c] hover:[&_path]:stroke-white transition-colors duration-200 flex items-center justify-center right-1.5 max-md:hidden"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
            <span className="sr-only">Next</span>
          </button>
        </>
      )}
    </section>
  );
}
