import { useEffect, useState, useRef } from "react";
import {
  getHotProducts,
  getNewProducts,
  getGiftBoxProducts,
  getExploreProducts,
  type Product as APIProduct,
} from "@/lib/api/products";

export type ProductCarouselProduct = {
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

// Helper function to format price from API
const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return numPrice.toFixed(2);
};

// Helper function to convert API product to ProductCarousel format
const convertToProductCarouselFormat = (apiProduct: APIProduct): ProductCarouselProduct => ({
  name: apiProduct.name,
  href: `/product/${apiProduct.id}`,
  imageUrl: apiProduct.profile_pic_link,
  imageAlt: apiProduct.name,
  vendor: apiProduct.company,
  price: formatPrice(apiProduct.price),
  badge: apiProduct.new && apiProduct.hot ? ("both" as const) : apiProduct.hot ? ("hot" as const) : apiProduct.new ? ("new" as const) : undefined,
  new: apiProduct.new,
  hot: apiProduct.hot,
});

// Create 8 placeholder products for loading state
const createPlaceholderProducts = (): ProductCarouselProduct[] => {
  return Array.from({ length: 8 }, () => ({
    name: "",
    href: "#",
    imageUrl: "",
    imageAlt: "",
    vendor: "",
    price: "0.00",
  }));
};

// Helper function to pad products to 8 items
const padProducts = (products: ProductCarouselProduct[]): ProductCarouselProduct[] => {
  const padded = [...products];
  while (padded.length < 8) {
    padded.push({
      name: "",
      href: "#",
      imageUrl: "",
      imageAlt: "",
      vendor: "",
      price: "0.00",
    });
  }
  return padded.slice(0, 8);
};

/**
 * Hook for fetching hot products immediately (above the fold)
 */
export function useHotProducts() {
  const [products, setProducts] = useState<ProductCarouselProduct[]>(createPlaceholderProducts());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHotProducts = async () => {
      try {
        const apiProducts = await getHotProducts();
        const convertedProducts = apiProducts.map(convertToProductCarouselFormat);
        setProducts(padProducts(convertedProducts));
      } catch (error) {
        console.error("Failed to fetch hot products:", error);
        setProducts(createPlaceholderProducts());
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotProducts();
  }, []);

  return { products, isLoading };
}

/**
 * Hook for lazy loading products when section comes into view
 */
export function useLazyProducts(
  fetchFunction: () => Promise<APIProduct[]>,
  sectionName: string
) {
  const [products, setProducts] = useState<ProductCarouselProduct[]>(createPlaceholderProducts());
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasLoaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded) {
            setIsLoading(true);
            setHasLoaded(true);

            fetchFunction()
              .then((apiProducts) => {
                const convertedProducts = apiProducts.map(convertToProductCarouselFormat);
                setProducts(padProducts(convertedProducts));
              })
              .catch((error) => {
                console.error(`Failed to fetch ${sectionName} products:`, error);
                setProducts(createPlaceholderProducts());
              })
              .finally(() => {
                setIsLoading(false);
              });
          }
        });
      },
      { rootMargin: "100px" } // Start loading 100px before section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasLoaded, fetchFunction, sectionName]);

  return { products, isLoading, sectionRef };
}

/**
 * Hook for new products (lazy loaded)
 */
export function useNewProducts() {
  return useLazyProducts(getNewProducts, "new");
}

/**
 * Hook for gift box products (lazy loaded)
 */
export function useGiftBoxProducts() {
  return useLazyProducts(getGiftBoxProducts, "gift box");
}

/**
 * Hook for explore products (lazy loaded)
 */
export function useExploreProducts() {
  return useLazyProducts(getExploreProducts, "explore");
}
