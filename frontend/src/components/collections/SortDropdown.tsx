"use client";

import { ChevronDown } from "lucide-react";
import { useSortDropdown, type SortOption } from "@/hooks/useSortDropdown";

type SortOptionConfig = {
  value: SortOption;
  label: string;
};

const sortOptions: SortOptionConfig[] = [
  { value: "COLLECTION_DEFAULT", label: "Featured" },
  { value: "BEST_SELLING", label: "Best Selling" },
  { value: "CREATED", label: "Oldest" },
  { value: "CREATED_REVERSE", label: "Newest" },
  { value: "PRICE", label: "Price: Low to High" },
  { value: "PRICE_REVERSE", label: "Price: High to Low" },
];

type SortDropdownProps = {
  value?: SortOption;
  onChange?: (value: SortOption) => void;
};

export default function SortDropdown({ value = "COLLECTION_DEFAULT", onChange }: SortDropdownProps) {
  const {
    isOpen,
    isClosing,
    selectedValue,
    hoveredValue,
    dropdownRef,
    buttonRef,
    dropdownMenuRef,
    handleOpen,
    handleClose,
    handleSelect,
    setHoveredValue,
  } = useSortDropdown(value, onChange);

  const selectedOption = sortOptions.find((opt) => opt.value === selectedValue) || sortOptions[0];

  const handleOptionSelect = (option: SortOptionConfig) => {
    handleSelect(option.value);
  };

  return (
    <div className="ml-auto min-w-0 relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (isOpen) {
            handleClose();
          } else {
            handleOpen();
          }
        }}
        className="flex h-12 max-w-full items-center gap-2 overflow-hidden rounded-full border-2 border-black bg-white px-4 font-black tracking-wide uppercase shadow-3d sm:px-6 sm:text-lg"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="min-w-0 truncate">{selectedOption.label}</span>
        <ChevronDown className={`h-6 w-6 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {(isOpen || isClosing) && (
        <div
          ref={dropdownMenuRef}
          className={`absolute top-full right-0 mt-1 z-[9999] min-w-full rounded-xl border-2 border-gray-200 bg-white px-1 py-3 shadow-xl ${
            isClosing ? "dropdown-exit" : "dropdown-enter"
          }`}
          role="listbox"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col">
            {sortOptions.map((option) => {
              const isHighlighted = hoveredValue === option.value || (!hoveredValue && selectedValue === option.value);
              
              return (
                <div
                  key={option.value}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOptionSelect(option);
                  }}
                  onMouseEnter={() => setHoveredValue(option.value)}
                  onMouseLeave={() => setHoveredValue(null)}
                  className={`flex w-full items-center rounded-xl py-3 pr-1.5 pl-5 text-sm font-semibold capitalize outline-hidden select-none transition-colors cursor-pointer ${
                    isHighlighted ? "bg-pop-yellow-light" : ""
                  }`}
                  role="option"
                  aria-selected={selectedValue === option.value}
                >
                  {option.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
