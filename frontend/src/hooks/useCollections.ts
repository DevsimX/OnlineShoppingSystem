import { useEffect, useState } from "react";
import { getAllProducts, getProductsByCollection, type Product as APIProduct, type PaginatedResponse } from "@/lib/api/products";
import { formatPriceString } from "@/lib/utils";

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

// Helper function to convert API product to display format
const convertToProductFormat = (apiProduct: APIProduct): ProductCarouselProduct => ({
  name: apiProduct.name,
  href: `/products/${apiProduct.id}`,
  imageUrl: apiProduct.profile_pic_link,
  imageAlt: apiProduct.name,
  vendor: apiProduct.brand,
  price: formatPriceString(apiProduct.price),
  badge: apiProduct.new && apiProduct.hot ? ("both" as const) : apiProduct.hot ? ("hot" as const) : apiProduct.new ? ("new" as const) : undefined,
  new: apiProduct.new,
  hot: apiProduct.hot,
});

// Helper to format page title from slug
const formatPageTitle = (slug: string): string => {
  if (slug === "all-products") {
    return "All Products";
  }
  // Convert slug to readable title
  // e.g., "cooking-condiments" -> "Cooking Condiments"
  // e.g., "gifts-under-100" -> "Gifts Under $100"
  return slug
    .split("-")
    .map((word) => {
      // Handle special cases
      if (word === "under" || word === "below") return word;
      if (word.match(/^\d+$/)) return `$${word}`;
      // Capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export function useCollections(slug: string, page: number, pageSize: number = 20, sort?: string) {
  const [products, setProducts] = useState<ProductCarouselProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [pageTitle, setPageTitle] = useState("All Products");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let response: PaginatedResponse<APIProduct>;
        
        if (slug === "all-products") {
          // Fetch all products
          response = await getAllProducts(page, pageSize, sort);
          setPageTitle("All Products");
        } else {
          // Use new collection endpoint
          response = await getProductsByCollection(slug, page, pageSize, sort);
          setPageTitle(formatPageTitle(slug));
        }

        const convertedProducts = response.results.map(convertToProductFormat);
        setProducts(convertedProducts);
        setTotalCount(response.count);
        setHasNext(response.next !== null);
        setHasPrevious(response.previous !== null);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
        setTotalCount(0);
        setPageTitle(formatPageTitle(slug));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, page, pageSize, sort]);

  return {
    products,
    isLoading,
    totalCount,
    hasNext,
    hasPrevious,
    pageTitle,
  };
}
