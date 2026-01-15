"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type CategoryItem = {
  name: string;
  href: string;
  imageUrl: string;
  alt: string;
};

const categories: CategoryItem[] = [
  { name: "All Products", href: "/collections/all-products", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/9be88a3a4a1bdf6ce0b6d5787110f6f1d31e6b58-120x120.svg?w=110&h=110&auto=format", alt: "All Products Icon" },
  { name: "Canberra Merch", href: "/collections/canberra-merch", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/b04923b31262d60134cb842512e2679b69365c37-120x120.svg?w=110&h=110&auto=format", alt: "Canberra Merch Icon" },
  { name: "Beer, Wine & Spirits", href: "/collections/beer-wine-spirits", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/40d96e21c8759bc6466eb8a0b686bcaa6acf390a-120x120.svg?w=110&h=110&auto=format", alt: "Beer, Wine & Spirits Icon" },
  { name: "Snacks", href: "/collections/snacks", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/3ad47158719656776236364c01462a85f2ff4785-120x120.svg?w=110&h=110&auto=format", alt: "Snacks Icon" },
  { name: "Confectionary", href: "/collections/sweet-treats", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/13fd8e61ac056e4ea340849d0e093f675e6e67f0-120x120.svg?w=110&h=110&auto=format", alt: "Confectionary Icon" },
  { name: "Cooking & Condiments", href: "/collections/cooking-condiments", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/90e439ede1aa0609fdae52f529837850d40809d7-120x120.svg?w=110&h=110&auto=format", alt: "Cooking & Condiments Icon" },
  { name: "Coffee & Tea", href: "/collections/coffee-tea", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/cb1386f9303f41200c19ca5fb8e3b2172f8ecba6-120x120.svg?w=110&h=110&auto=format", alt: "Coffee & Tea Icon" },
  { name: "Non-Alc Drinks", href: "/collections/non-alcoholic-drinks", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/63b8dc9c1a11397f40d6c3afb29e5740be50cf82-120x120.svg?w=110&h=110&auto=format", alt: "Non-Alc Drinks Icon" },
  { name: "Jewellery", href: "/collections/jewellery", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/81cfcfc3bf1e8874e27f5bac91efc1f94e17115b-120x120.svg?w=110&h=110&auto=format", alt: "Jewellery Icon" },
  { name: "Beauty & Fragrances", href: "/collections/beauty-fragrances", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/eace9ed886148dba78f04da432f04536973fefcb-120x120.svg?w=110&h=110&auto=format", alt: "Beauty & Fragrances Icon" },
  { name: "Accessories", href: "/collections/accessories", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/fbbc9ab9ba28306098c04517ff6facbe6ec042b0-120x120.svg?w=110&h=110&auto=format", alt: "Accessories Icon" },
  { name: "Books", href: "/collections/books", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/ab404a4c41c84df471f2f343eda34d586c7538e6-120x120.svg?w=110&h=110&auto=format", alt: "Books Icon" },
  { name: "POP Merch", href: "/collections/pop-merch", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/9249946e9d38e389f715a46a48bd32aec723ad40-120x120.svg?w=110&h=110&auto=format", alt: "POP Merch Icon" },
  { name: "Prints", href: "/collections/prints", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/09bb2bacc0d71d47773faa7c57858592c0f8e1f5-120x120.svg?w=110&h=110&auto=format", alt: "Prints Icon" },
  { name: "Games", href: "/collections/games", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/72fc639781bef2cb2bcc51aaf3f390d512adc58a-120x120.svg?w=110&h=110&auto=format", alt: "Games Icon" },
  { name: "Skincare", href: "/collections/skincare", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/240310fab078f51233ed9ea230336bef73cefbf6-120x120.svg?w=110&h=110&auto=format", alt: "Skincare Icon" },
  { name: "Greeting Cards", href: "/collections/greeting-cards", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/98bf122ff29200542e720c73060db7483b563bee-120x120.svg?w=110&h=110&auto=format", alt: "Greeting Cards Icon" },
  { name: "Candles & Diffusers", href: "/collections/candles-diffusers", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/a23192b8d82c5715af6aca98bb7017dc0e1ea6b5-120x120.svg?w=110&h=110&auto=format", alt: "Candles & Diffusers Icon" },
  { name: "Bath", href: "/collections/bath", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/34121d1ca7a998aa2b8d55ff3b026e20d064da32-120x120.svg?w=110&h=110&auto=format", alt: "Bath Icon" },
  { name: "Ceramics & Tableware", href: "/collections/ceramics-tableware", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/9fc9cc3cf029ded3c875b8ba6f82c8bcb32cb071-120x120.svg?w=110&h=110&auto=format", alt: "Ceramics & Tableware Icon" },
  { name: "Stickers & Stationery", href: "/collections/stationery", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/e4cc7713c1cb0743cde92494333e4cdd2b77cdd3-120x120.svg?w=110&h=110&auto=format", alt: "Stickers & Stationery Icon" },
  { name: "Kids Toys", href: "/collections/kids-toys", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/e98e0f04770f34311d41d9f2134ea1576f82c7e0-120x120.svg?w=110&h=110&auto=format", alt: "Kids Toys Icon" },
  { name: "Pet Goods", href: "/collections/pet-goods", imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/c3c1863b674ec01c237cd3da21add3d6e9e75dbc-120x120.svg?w=110&h=110&auto=format", alt: "Pet Goods Icon" },
];

export default function CategoryCarousel() {
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
    return () => container.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = 300;
    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative border-b-2 bg-[var(--pop-yellow-mid)] py-4 lg:py-6">
      <div className="relative w-full overflow-hidden 2xl:max-w-[1535px] 2xl:mx-auto">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pr-20 md:pr-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category, index) => (
            <div
              key={category.href}
              className={`flex-shrink-0 ${index === 0 ? "ml-4 md:ml-6" : ""} ${index === categories.length - 1 ? "mr-4 md:mr-6" : ""}`}
            >
              <Link href={category.href} className="group block text-center text-sm font-semibold">
                <img
                  src={category.imageUrl}
                  alt={category.alt}
                  className="mx-auto pb-2 transition-all group-hover:rotate-12 md:pb-3"
                  height="110"
                  width="110"
                  loading="eager"
                  decoding="async"
                />
                {category.name}
              </Link>
            </div>
          ))}
        </div>
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute cursor-pointer z-[2] rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] w-12 h-12 p-2 justify-center items-center select-none top-1/2 -translate-y-1/2 hover:bg-[#30897c] hover:[&_path]:stroke-white transition-colors duration-200 flex items-center justify-center right-1.5"
            aria-label="Next items"
          >
            <ChevronRight className="w-6 h-6" />
            <span className="sr-only">Next</span>
          </button>
        )}
      </div>
    </div>
  );
}
