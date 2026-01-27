import { useRef, useState } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function useHeaderSearch(router: AppRouterInstance) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setIsSearchOpen(true);
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim()) {
      setIsSearchOpen(true);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const closeSearch = () => setIsSearchOpen(false);

  const closeMobileSearch = () => {
    setIsMobileSearchVisible(false);
    setIsSearchOpen(false);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchVisible((prev) => {
      const next = !prev;
      if (next) {
        // Show dropdown when opening search on mobile.
        if (searchQuery.trim()) setIsSearchOpen(true);
        // Focus on next tick after input is mounted.
        setTimeout(() => searchInputRef.current?.focus(), 0);
      } else {
        setIsSearchOpen(false);
      }
      return next;
    });
  };

  return {
    searchQuery,
    isSearchOpen,
    isMobileSearchVisible,
    searchInputRef,
    handleSearchChange,
    handleSearchFocus,
    handleSearchKeyDown,
    closeSearch,
    closeMobileSearch,
    toggleMobileSearch,
  };
}

