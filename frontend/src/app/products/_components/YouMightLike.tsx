"use client";

import ProductCarousel from "@/components/home/ProductCarousel";
import { type ProductCarouselProduct } from "@/hooks/useProductDetail";

type YouMightLikeProps = {
  products: ProductCarouselProduct[];
  isLoading: boolean;
};

export default function YouMightLike({ products, isLoading }: YouMightLikeProps) {
  return (
    <section className="border-b-2 py-12 md:py-16">
      <div className="flex flex-wrap justify-between px-6">
        <div>
          <h2 className="font-reika-script leading-tight text-4xl md:text-[56px]">You Might Like</h2>
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
