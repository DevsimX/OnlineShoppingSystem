"use client";

import CategoryCarousel from "@/components/home/CategoryCarousel";
import HeroSection from "@/components/home/HeroSection";
import ProductCarousel from "@/components/home/ProductCarousel";
import CTASection from "@/components/home/CTASection";
import InstagramFeed from "@/components/home/InstagramFeed";
import Marquee from "@/components/home/Marquee";
import {
  useHotProducts,
  useNewProducts,
  useGiftBoxProducts,
  useExploreProducts,
} from "@/hooks/useProductSections";

// Static data for Great Gifts (unchanged)
const greatGiftsCategories = [
  {
    name: "Memorabilia",
    href: "/collections/memorabilia",
    imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/d714d6bcb6ef7e218c92e0fa7538383b2a5e49e5-664x664.jpg?w=300&h=300&auto=format",
    imageAlt: "Memorabilia",
    price: "",
  },
  {
    name: "Beer, Wine & Spirits",
    href: "/collections/beer-wine-spirits",
    imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/b2a40cc43a2978f064f1e00fbfc80be6e8a786af-664x664.jpg?w=300&h=300&auto=format",
    imageAlt: "Beer, Wine & Spirits",
    price: "",
  },
  {
    name: "Jewellery",
    href: "/collections/jewellery",
    imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/5199f80e92c7dfe537d7ff0012246326b90e4534-664x664.jpg?w=300&h=300&auto=format",
    imageAlt: "Jewellery",
    price: "",
  },
  {
    name: "Snacks",
    href: "/collections/snacks",
    imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/daf907f049b5f44b19c3c982242be7b3f0c14c69-664x664.jpg?w=300&h=300&auto=format",
    imageAlt: "Snacks",
    price: "",
  },
  {
    name: "Coffee & Tea",
    href: "/collections/coffee-tea",
    imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/2384b26d839ebc6c4a4aea3cb6045ae00172a868-664x664.jpg?w=300&h=300&auto=format",
    imageAlt: "Coffee & Tea",
    price: "",
  },
  {
    name: "Beauty & Fragrances",
    href: "/collections/beauty-fragrances",
    imageUrl: "https://cdn.sanity.io/images/q52u2xck/production/125bf3f3d78505fd7fed524fca88319293dc6abb-664x664.jpg?w=300&h=300&auto=format",
    imageAlt: "Beauty & Fragrances",
    price: "",
  },
];

export default function Home() {
  // Use custom hooks for product sections
  const { products: hotProducts, isLoading: isLoadingHot } = useHotProducts();
  const { products: newProducts, isLoading: isLoadingNew, sectionRef: newSectionRef } = useNewProducts();
  const { products: giftBoxProducts, isLoading: isLoadingGiftBox, sectionRef: giftBoxSectionRef } = useGiftBoxProducts();
  const { products: exploreProducts, isLoading: isLoadingExplore, sectionRef: exploreSectionRef } = useExploreProducts();

  return (
    <main style={{ viewTransitionName: "main-content" }}>
      <CategoryCarousel />
      <HeroSection />
      <Marquee />
      <ProductCarousel
        title="What's Hot"
        titleHref="/collections/whats-hot"
        products={hotProducts}
        isLoading={isLoadingHot}
      />
      <div className="border-t-2 border-b-2 bg-pop-yellow-mid">
        <ProductCarousel title="Great Gifts" products={greatGiftsCategories} />
      </div>
      <div ref={newSectionRef}>
        <ProductCarousel
          title="New Stuff"
          titleHref="/collections/new-stuff"
          products={newProducts}
          isLoading={isLoadingNew}
        />
      </div>
      <div ref={giftBoxSectionRef}>
        <ProductCarousel
          title="Gift Boxes"
          titleHref="/collections/gift-boxes"
          products={giftBoxProducts}
          isLoading={isLoadingGiftBox}
        />
      </div>
      <div ref={exploreSectionRef}>
        <ProductCarousel
          title="More to Explore"
          titleHref="/collections/all-products"
          products={exploreProducts}
          isLoading={isLoadingExplore}
        />
      </div>
      <CTASection />
      <InstagramFeed />
      <Marquee />
    </main>
  );
}
