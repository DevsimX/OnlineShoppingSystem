"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { searchProducts, type Product } from "@/lib/api/products";
import { searchCollections } from "@/lib/collections";

type SearchDropdownProps = {
  query: string;
  isOpen: boolean;
  onClose: () => void;
};

type CollectionSuggestion = {
  name: string;
  slug: string;
};

export default function SearchDropdown({ query, isOpen, onClose }: SearchDropdownProps) {
  const [suggestions, setSuggestions] = useState<CollectionSuggestion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim() || !isOpen) {
      setSuggestions([]);
      setProducts([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    // Immediately show loading and clear previous results when query changes
    setIsLoading(true);
    setProducts([]);
    setHasSearched(false);

    // Search collections immediately (client-side, no debounce needed)
    const collectionResults = searchCollections(query, 8);
    setSuggestions(collectionResults);

    const fetchSearchResults = async () => {
      try {
        // Search products (API call, debounced)
        const result = await searchProducts(query, 8);
        setProducts(result.products);
        setHasSearched(true);
      } catch (error) {
        console.error("Search error:", error);
        setProducts([]);
        setHasSearched(true);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the actual API call
    const debounceTimer = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || (!query.trim() && !isLoading)) {
    return null;
  }

  const hasResults = suggestions.length > 0 || products.length > 0;
  const hasNoResults = !isLoading && query.trim() && hasSearched && !hasResults;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 left-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-2xl border-2 border-pop-neutral-black bg-white px-6 shadow-3d"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {isLoading ? (
        <div className="py-6 text-center">
          <p className="text-xl font-extrabold text-black">Searching...</p>
        </div>
      ) : hasNoResults ? (
        <div className="py-4 text-center">
          <p className="text-xl font-extrabold text-black">No results found for &quot;{query}&quot;</p>
        </div>
      ) : (
        <>
          {suggestions.length > 0 && (
            <div className="border-b-2 border-dashed py-6">
              <h3 className="font-reika-script text-3xl">Search Suggestions</h3>
              <div className="grid gap-6 pt-2 lg:grid-cols-2">
                {suggestions.map((suggestion) => (
                  <Link
                    key={suggestion.slug}
                    href={`/collections/${suggestion.slug}`}
                    onClick={onClose}
                    className="flex w-full cursor-pointer items-center gap-3 rounded text-left hover:text-pop-red-accent"
                  >
                    <div className="font-price-check text-lg leading-[85%] font-stretch-expanded md:text-xl">
                      {suggestion.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {products.length > 0 && (
            <div className="py-6">
              <h3 className="font-reika-script text-3xl">Products</h3>
              <div className="grid gap-x-6 gap-y-2 pt-2 lg:grid-cols-2">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    onClick={onClose}
                    className="group flex w-full cursor-pointer gap-3 rounded p-2 text-left"
                  >
                    {product.profile_pic_link && (
                      <Image
                        className="h-20 w-20 shrink-0 rounded-lg object-cover"
                        src={product.profile_pic_link}
                        alt={product.name}
                        width={80}
                        height={80}
                        unoptimized
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-price-check text-lg leading-[85%] font-stretch-expanded group-hover:text-pop-red-accent md:text-xl">
                        {product.name.length > 40 ? `${product.name.substring(0, 40)}...` : product.name}
                      </div>
                      <div className="font-trade-gothic pt-1 text-sm">{product.brand}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {hasResults && (
            <div className="pb-6">
              <Link
                href={`/search/${encodeURIComponent(query)}`}
                onClick={onClose}
                className="flex items-center justify-center uppercase tracking-wide font-trade-gothic font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-pop-red-accent text-white hover:bg-pop-teal-mid border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-12 px-6 py-2 text-lg md:text-xl rounded-full w-full"
              >
                See all results
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  className="h-5 w-5 ml-2"
                >
                  <path
                    d="M3.33337 10.5H16.6667M16.6667 10.5L11.6667 5.5M16.6667 10.5L11.6667 15.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
