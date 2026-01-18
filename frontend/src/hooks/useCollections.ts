import { useEffect, useState } from "react";
import { getAllProducts, getProductsByCategory, type Product as APIProduct, type PaginatedResponse } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";

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

// Helper function to format price
const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return numPrice.toFixed(2);
};

// Helper function to convert API product to display format
const convertToProductFormat = (apiProduct: APIProduct): ProductCarouselProduct => ({
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

// Helper to convert URL slug to category name
const slugToCategoryName = (slug: string, categories: { name: string }[]): string | null => {
  const normalize = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const normalizedSlug = normalize(slug);

  // Try to find matching category
  for (const cat of categories) {
    const normalizedCatName = normalize(cat.name);
    if (normalizedCatName === normalizedSlug) {
      return cat.name;
    }
  }

  // Fallback: try to match by removing common words and special chars
  const simplifiedSlug = normalizedSlug.replace(/-/g, "");
  for (const cat of categories) {
    const simplifiedCatName = normalize(cat.name).replace(/-/g, "");
    if (simplifiedCatName === simplifiedSlug) {
      return cat.name;
    }
  }

  return null;
};

export function useCollections(slug: string, page: number, pageSize: number = 20) {
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
        // Fetch categories first to get category names
        const cats = await getCategories();

        let response: PaginatedResponse<APIProduct>;
        
        if (slug === "all-products") {
          // Fetch all products
          response = await getAllProducts(page, pageSize);
          setPageTitle("All Products");
        } else {
          // Map slug to category name
          const mappedName = slugToCategoryName(slug, cats);
          if (!mappedName) {
            // Category not found, show empty or error
            setProducts([]);
            setTotalCount(0);
            setPageTitle(slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()));
            setIsLoading(false);
            return;
          }
          setPageTitle(mappedName);
          response = await getProductsByCategory(mappedName, page, pageSize);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, page, pageSize]);

  return {
    products,
    isLoading,
    totalCount,
    hasNext,
    hasPrevious,
    pageTitle,
  };
}
