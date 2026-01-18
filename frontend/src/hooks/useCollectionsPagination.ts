import { useRouter } from "next/navigation";
import { useParams, useSearchParams } from "next/navigation";
import type { SortOption } from "@/hooks/useSortDropdown";

export function useCollectionsPagination() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  // Get page, page_size, and sort from URL query params
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("page_size") || "20", 10);
  const sort = (searchParams.get("sort") || "COLLECTION_DEFAULT") as SortOption;

  const buildUrl = (page: number, sortParam?: SortOption) => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    
    const sortToUse = sortParam || sort;
    if (sortToUse && sortToUse !== "COLLECTION_DEFAULT") {
      params.append("sort", sortToUse);
    }
    
    return `/collections/${slug}?${params.toString()}`;
  };

  const handleNextPage = (hasNext: boolean) => {
    if (hasNext) {
      const newPage = currentPage + 1;
      router.push(buildUrl(newPage));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousPage = (hasPrevious: boolean) => {
    if (hasPrevious) {
      const newPage = currentPage - 1;
      router.push(buildUrl(newPage));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSortChange = (newSort: SortOption) => {
    router.push(buildUrl(1, newSort)); // Reset to page 1 when sort changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    slug,
    currentPage,
    pageSize,
    sort,
    handleNextPage,
    handlePreviousPage,
    handleSortChange,
  };
}
