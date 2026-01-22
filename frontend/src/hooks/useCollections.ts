import { useEffect, useState, useMemo } from "react";
import { getAllProducts, getProductsByCollection, type Product as APIProduct, type PaginatedResponse } from "@/lib/api/products";
import { formatPriceString } from "@/lib/utils";

export type FilterState = {
  available?: boolean | null;
  minPrice?: number;
  maxPrice?: number;
  productType?: string[];
  brand?: string[];
};

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

export type FilterMetadata = {
  availableCounts: {
    inStock: number;
    outOfStock: number;
  };
  priceRange: {
    min: number;
    max: number;
  };
  productTypes: Array<{ name: string; count: number }>;
  brands: Array<{ name: string; count: number }>;
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

export function useCollections(slug: string, page: number, pageSize: number = 20, sort?: string, filters?: FilterState) {
  const [products, setProducts] = useState<ProductCarouselProduct[]>([]);
  const [allProductsForMetadata, setAllProductsForMetadata] = useState<APIProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [pageTitle, setPageTitle] = useState("All Products");

  // Fetch paginated products
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let response: PaginatedResponse<APIProduct>;
        
        if (slug === "all-products") {
          response = await getAllProducts(page, pageSize, sort, filters);
          setPageTitle("All Products");
        } else {
          response = await getProductsByCollection(slug, page, pageSize, sort, filters);
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
  }, [slug, page, pageSize, sort, filters]);

  // Fetch all products for metadata calculation (without filters, without pagination)
  useEffect(() => {
    const fetchMetadata = async () => {
      setIsLoadingMetadata(true);
      try {
        // Fetch all products for the collection without filters to get accurate metadata
        // Use a large page size to get all products
        let response: PaginatedResponse<APIProduct>;
        
        if (slug === "all-products") {
          response = await getAllProducts(1, 10000); // Large page size to get all
        } else {
          response = await getProductsByCollection(slug, 1, 10000); // Large page size to get all
        }

        setAllProductsForMetadata(response.results);
      } catch (error) {
        console.error("Failed to fetch products for metadata:", error);
        setAllProductsForMetadata([]);
      } finally {
        setIsLoadingMetadata(false);
      }
    };

    fetchMetadata();
  }, [slug]); // Only depend on slug, not filters

  // Calculate filter metadata from all products in collection
  const filterMetadata = useMemo<FilterMetadata>(() => {
    if (allProductsForMetadata.length === 0) {
      return {
        availableCounts: { inStock: 0, outOfStock: 0 },
        priceRange: { min: 0, max: 0 },
        productTypes: [],
        brands: [],
      };
    }

    // Calculate price range
    const prices = allProductsForMetadata.map(p => parseFloat(p.price)).filter(p => !isNaN(p));
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    // Calculate availability counts
    let inStock = 0;
    let outOfStock = 0;
    allProductsForMetadata.forEach((product) => {
      // In stock: status = 'available' AND current_stock > 0
      // Out of stock: status = 'available' AND current_stock = 0
      if (product.status === 'available') {
        const stock = product.current_stock ?? 0;
        if (stock > 0) {
          inStock++;
        } else {
          outOfStock++;
        }
      }
    });

    // Calculate product types with counts (type is array of strings per product)
    const typeCounts = new Map<string, number>();
    allProductsForMetadata.forEach((product) => {
      const types = product.type;
      if (Array.isArray(types)) {
        types.forEach((t: string) => {
          const name = typeof t === "string" ? t.trim() : String(t).trim();
          if (name) {
            typeCounts.set(name, (typeCounts.get(name) || 0) + 1);
          }
        });
      }
    });

    const productTypes = Array.from(typeCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));

    // Calculate brands with counts
    const brandCounts = new Map<string, number>();
    allProductsForMetadata.forEach((product) => {
      if (product.brand) {
        brandCounts.set(product.brand, (brandCounts.get(product.brand) || 0) + 1);
      }
    });

    const brands = Array.from(brandCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      availableCounts: {
        inStock,
        outOfStock,
      },
      priceRange: {
        min: minPrice,
        max: maxPrice,
      },
      productTypes,
      brands,
    };
  }, [allProductsForMetadata]);

  return {
    products,
    isLoading,
    totalCount,
    hasNext,
    hasPrevious,
    pageTitle,
    filterMetadata,
    isLoadingMetadata,
  };
}
