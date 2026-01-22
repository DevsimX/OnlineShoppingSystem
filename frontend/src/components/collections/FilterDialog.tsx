"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { FilterState } from "@/hooks/useCollections";

type FilterDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  onClear: () => void;
  initialFilters?: FilterState;
  availableCounts?: {
    inStock: number;
    outOfStock: number;
  };
  productTypes?: Array<{ name: string; count: number }>;
  brands?: Array<{ name: string; count: number }>;
  priceRange?: { min: number; max: number };
};

export default function FilterDialog({
  isOpen,
  onClose,
  onApply,
  onClear,
  initialFilters = {},
  availableCounts,
  productTypes = [],
  brands = [],
  priceRange,
}: FilterDialogProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = "hidden";
      // Trigger animation after mount
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      document.body.style.overflow = "";
      // Delay unmount to allow exit animation to complete
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500); // Match animation duration
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!shouldRender && !isOpen) return null;

  const handleToggleAvailability = (value: boolean | null) => {
    setFilters((prev) => ({
      ...prev,
      available: prev.available === value ? null : value,
    }));
  };

  const handlePriceChange = (field: "minPrice" | "maxPrice", value: string) => {
    const numValue = value === "" ? undefined : parseFloat(value);
    setFilters((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const handleToggleProductType = (type: string) => {
    setFilters((prev) => {
      const current = prev.productType || [];
      const updated = current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type];
      return { ...prev, productType: updated.length > 0 ? updated : undefined };
    });
  };

  const handleToggleBrand = (brand: string) => {
    setFilters((prev) => {
      const current = prev.brand || [];
      const updated = current.includes(brand)
        ? current.filter((b) => b !== brand)
        : [...current, brand];
      return { ...prev, brand: updated.length > 0 ? updated : undefined };
    });
  };

  const handleClear = () => {
    setFilters({});
    onClear(); // Clear filters in URL and navigate
    onClose(); // Close the dialog
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const isChecked = (value: boolean | null) => filters.available === value;
  const isProductTypeChecked = (type: string) => filters.productType?.includes(type) || false;
  const isBrandChecked = (brand: string) => filters.brand?.includes(brand) || false;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-500"
        data-dialog-overlay=""
        style={{
          opacity: isVisible ? 1 : 0,
          pointerEvents: "auto",
        }}
        onClick={onClose}
      />

      {/* Side Drawer - slides from LEFT */}
      <div
        className="fixed top-0 left-0 z-[99999] h-full w-full overflow-auto border-l-2 border-black bg-pop-yellow-light shadow-lg lg:w-[400px] transition-transform duration-500 ease-in-out"
        role="dialog"
        aria-modal="true"
        data-dialog-content=""
        tabIndex={-1}
        style={{
          transform: isVisible ? "translateX(0)" : "translateX(-100%)",
          pointerEvents: "auto",
          userSelect: "text",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full">
          <div className="flex h-full flex-col justify-between py-4">
            {/* Header */}
            <div className="flex w-full items-center justify-between border-b-2 px-6 pb-4">
              <h2 className="font-display font-reika-script text-4xl">Filters</h2>
              <button
                className="IconMenu"
                onClick={onClose}
                tabIndex={0}
                data-dialog-close=""
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
              {/* Availability */}
              <div>
                <h3 className="font-price-check text-2xl font-stretch-expanded">Availability</h3>
                <div className="mt-4 flex flex-col gap-4 rounded-2xl border-2 border-pop-neutral-black bg-white px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isChecked(true)}
                      onClick={() => handleToggleAvailability(true)}
                      className={`peer inline-flex size-5 shrink-0 items-center justify-center rounded border-2 shadow-3d transition-all duration-150 ease-in-out active:scale-[0.98] ${
                        isChecked(true) ? "bg-black border-black" : "bg-white border-black"
                      }`}
                    >
                      {isChecked(true) && (
                        <div className="text-white">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 3L4.5 8.5L2 6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                    <label className="text-lg font-semibold cursor-pointer" onClick={() => handleToggleAvailability(true)}>
                      In stock {availableCounts?.inStock !== undefined && (
                        <span className="text-sm text-gray-600">({availableCounts.inStock})</span>
                      )}
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isChecked(false)}
                      onClick={() => handleToggleAvailability(false)}
                      className={`peer inline-flex size-5 shrink-0 items-center justify-center rounded border-2 shadow-3d transition-all duration-150 ease-in-out active:scale-[0.98] ${
                        isChecked(false) ? "bg-black border-black" : "bg-white border-black"
                      }`}
                    >
                      {isChecked(false) && (
                        <div className="text-white">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 3L4.5 8.5L2 6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                    <label className="text-lg font-semibold cursor-pointer" onClick={() => handleToggleAvailability(false)}>
                      Out of stock {availableCounts?.outOfStock !== undefined && (
                        <span className="text-sm text-gray-600">({availableCounts.outOfStock})</span>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="font-price-check text-2xl font-stretch-expanded">Price</h3>
                <div className="mt-4 flex flex-col gap-4 rounded-2xl border-2 border-pop-neutral-black bg-white px-4 py-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label htmlFor="min-price" className="mb-1 block text-sm font-semibold">
                        Min
                      </label>
                      <input
                        id="min-price"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        value={filters.minPrice ?? ""}
                        onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                        className="w-full rounded-lg border-2 border-black px-3 py-2 font-family-reika focus:ring-0 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="max-price" className="mb-1 block text-sm font-semibold">
                        Max
                      </label>
                      <input
                        id="max-price"
                        type="number"
                        min="0"
                        step="1"
                        placeholder={priceRange?.max?.toString() || ""}
                        value={filters.maxPrice ?? ""}
                        onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                        className="w-full rounded-lg border-2 border-black px-3 py-2 font-family-reika focus:ring-0 focus:outline-none"
                      />
                    </div>
                  </div>
                  {filters.minPrice !== undefined || filters.maxPrice !== undefined ? (
                    <div className="text-xs font-semibold">
                      Range: ${filters.minPrice ?? 0} - ${filters.maxPrice ?? priceRange?.max ?? "∞"}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Product Type */}
              {productTypes.length > 0 && (
                <div>
                  <h3 className="font-price-check text-2xl font-stretch-expanded">Product type</h3>
                  <div className="mt-4 flex flex-col gap-4 rounded-2xl border-2 border-pop-neutral-black bg-white px-4 py-4">
                    {productTypes.map((type) => (
                      <div key={type.name} className="flex items-center gap-2">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={isProductTypeChecked(type.name)}
                          onClick={() => handleToggleProductType(type.name)}
                          className={`peer inline-flex size-5 shrink-0 items-center justify-center rounded border-2 shadow-3d transition-all duration-150 ease-in-out active:scale-[0.98] ${
                            isProductTypeChecked(type.name) ? "bg-black border-black" : "bg-white border-black"
                          }`}
                        >
                          {isProductTypeChecked(type.name) && (
                            <div className="text-white">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10 3L4.5 8.5L2 6"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          )}
                        </button>
                        <label
                          className="text-lg font-semibold cursor-pointer"
                          onClick={() => handleToggleProductType(type.name)}
                        >
                          {type.name} {type.count !== undefined && (
                            <span className="text-sm text-gray-600">({type.count})</span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Brand */}
              {brands.length > 0 && (
                <div>
                  <h3 className="font-price-check text-2xl font-stretch-expanded">Brand</h3>
                  <div className="mt-4 flex flex-col gap-4 rounded-2xl border-2 border-pop-neutral-black bg-white px-4 py-4">
                    {brands.map((brand) => (
                      <div key={brand.name} className="flex items-center gap-2">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={isBrandChecked(brand.name)}
                          onClick={() => handleToggleBrand(brand.name)}
                          className={`peer inline-flex size-5 shrink-0 items-center justify-center rounded border-2 shadow-3d transition-all duration-150 ease-in-out active:scale-[0.98] ${
                            isBrandChecked(brand.name) ? "bg-black border-black" : "bg-white border-black"
                          }`}
                        >
                          {isBrandChecked(brand.name) && (
                            <div className="text-white">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10 3L4.5 8.5L2 6"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          )}
                        </button>
                        <label
                          className="text-lg font-semibold cursor-pointer"
                          onClick={() => handleToggleBrand(brand.name)}
                        >
                          {brand.name} {brand.count !== undefined && (
                            <span className="text-sm text-gray-600">({brand.count})</span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-auto border-t-2 px-6 py-4">
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handleClear}
                  className="flex items-center justify-center uppercase tracking-wide font-family-trade-gothic font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-white text-black hover:bg-pop-teal-mid hover:text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-12 px-6 py-2 text-lg md:text-xl rounded-full"
                >
                  Clear
                </button>
                <button
                  onClick={handleApply}
                  className="flex items-center justify-center uppercase tracking-wide font-family-trade-gothic font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-pop-red-accent text-white hover:bg-pop-teal-mid border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-12 px-6 py-2 text-lg md:text-xl rounded-full"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
