"use client";

import Link from "next/link";

type Category = {
  name: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
};

const categories: Category[] = [
  {
    name: "Memorabilia",
    href: "/collections/memorabilia",
    imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/d714d6bcb6ef7e218c92e0fa7538383b2a5e49e5-664x664.jpg?w=300&h=300&auto=format",
    imageAlt: "Memorabilia",
  },
  {
    name: "Beer, Wine & Spirits",
    href: "/collections/beer-wine-spirits",
    imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/b2a40cc43a2978f064f1e00fbfc80be6e8a786af-664x664.jpg?w=300&h=300&auto=format",
    imageAlt: "Beer, Wine & Spirits",
  },
  {
    name: "Jewellery",
    href: "/collections/jewellery",
    imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/5199f80e92c7dfe537d7ff0012246326b90e4534-664x664.jpg?w=300&h=300&auto=format",
    imageAlt: "Jewellery",
  },
  {
    name: "Snacks",
    href: "/collections/snacks",
    imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/daf907f049b5f44b19c3c982242be7b3f0c14c69-664x664.jpg?w=300&h=300&auto=format",
    imageAlt: "Snacks",
  },
  {
    name: "Coffee & Tea",
    href: "/collections/coffee-tea",
    imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/2384b26d839ebc6c4a4aea3cb6045ae00172a868-664x664.jpg?w=300&h=300&auto=format",
    imageAlt: "Coffee & Tea",
  },
  {
    name: "Beauty & Fragrances",
    href: "/collections/beauty-fragrances",
    imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/125bf3f3d78505fd7fed524fca88319293dc6abb-664x664.jpg?w=300&h=300&auto=format",
    imageAlt: "Beauty & Fragrances",
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-12 border-t-2 border-b-2 bg-[var(--pop-yellow-mid)]">
      <div className="flex flex-wrap justify-between px-6">
        <h2 className="leading-tight text-4xl sm:text-[56px]">Great Gifts</h2>
      </div>
      <div className="relative mt-6 overflow-hidden">
        <div className="overflow-hidden">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide px-6" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {categories.map((category, index) => (
              <div key={category.href} className={`flex-shrink-0 ${index === categories.length - 1 ? "mr-6" : ""}`}>
                <Link href={category.href} className="block text-inherit no-underline">
                  <div className="group relative flex w-full cursor-pointer flex-col">
                    <div className="relative rounded-3xl border-2 border-transparent transition-all group-hover:border-black">
                      <img
                        src={category.imageUrl}
                        className="aspect-square h-auto w-full rounded-3xl object-cover sm:rounded-[22px]"
                        height="300"
                        width="300"
                        loading="lazy"
                        decoding="async"
                        alt={category.imageAlt}
                      />
                    </div>
                    <div className="pt-6">
                      <span className="text-xl leading-[85%] text-black font-stretch-expanded sm:text-2xl">
                        {category.name}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
