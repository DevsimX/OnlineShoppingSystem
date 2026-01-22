import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import type { FilterState } from "@/hooks/useCollections";

export function useCollectionFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters = useMemo<FilterState>(() => {
    const available = searchParams.get("available");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const productType = searchParams.get("productType");
    const brand = searchParams.get("brand");

    return {
      available: available === null ? null : available === "true",
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      productType: productType ? productType.split(",").map((t) => decodeURIComponent(t.trim())) : undefined,
      brand: brand ? brand.split(",").map((b) => decodeURIComponent(b.trim())) : undefined,
    };
  }, [searchParams]);

  const applyFilters = (newFilters: FilterState, slug: string) => {
    const params = new URLSearchParams();
    
    // Preserve existing page and sort params
    const page = searchParams.get("page");
    const sort = searchParams.get("sort");
    if (page) params.set("page", page);
    if (sort) params.set("sort", sort);

    // Add filter params
    if (newFilters.available !== null && newFilters.available !== undefined) {
      params.set("available", newFilters.available.toString());
    }
    if (newFilters.minPrice !== undefined) {
      params.set("minPrice", newFilters.minPrice.toString());
    }
    if (newFilters.maxPrice !== undefined) {
      params.set("maxPrice", newFilters.maxPrice.toString());
    }
    if (newFilters.productType && newFilters.productType.length > 0) {
      // Join with comma, then encode the whole string to handle spaces properly
      params.set("productType", newFilters.productType.join(","));
    }
    if (newFilters.brand && newFilters.brand.length > 0) {
      // Join with comma, then encode the whole string to handle spaces properly
      params.set("brand", newFilters.brand.join(","));
    }

    // Reset to page 1 when filters change
    params.set("page", "1");
    
    router.push(`/collections/${slug}?${params.toString()}`);
  };

  const clearFilters = (slug: string) => {
    const params = new URLSearchParams();
    const sort = searchParams.get("sort");
    if (sort) params.set("sort", sort);
    router.push(`/collections/${slug}?${params.toString()}`);
  };

  return {
    filters,
    applyFilters,
    clearFilters,
  };
}
