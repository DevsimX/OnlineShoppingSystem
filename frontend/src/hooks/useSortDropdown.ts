import { useState, useRef, useEffect, useCallback } from "react";

export type SortOption = 
  | "COLLECTION_DEFAULT"
  | "BEST_SELLING"
  | "CREATED"
  | "CREATED_REVERSE"
  | "PRICE"
  | "PRICE_REVERSE";

type SortDropdownReturn = {
  isOpen: boolean;
  isClosing: boolean;
  selectedValue: SortOption;
  hoveredValue: SortOption | null;
  dropdownRef: React.RefObject<HTMLDivElement>;
  buttonRef: React.RefObject<HTMLButtonElement>;
  dropdownMenuRef: React.RefObject<HTMLDivElement>;
  handleOpen: () => void;
  handleClose: () => void;
  handleSelect: (value: SortOption, onChange?: (value: SortOption) => void) => void;
  setHoveredValue: (value: SortOption | null) => void;
};

export function useSortDropdown(
  initialValue: SortOption = "COLLECTION_DEFAULT",
  onChange?: (value: SortOption) => void
): SortDropdownReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedValue, setSelectedValue] = useState<SortOption>(initialValue);
  const [hoveredValue, setHoveredValue] = useState<SortOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  // Sync selectedValue when initialValue prop changes
  useEffect(() => {
    setSelectedValue(initialValue);
  }, [initialValue]);

  // Handle close animation
  const handleClose = useCallback(() => {
    if (dropdownMenuRef.current) {
      setIsClosing(true);
      dropdownMenuRef.current.classList.remove("dropdown-enter");
      dropdownMenuRef.current.classList.add("dropdown-exit");
      // Remove from DOM after animation
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 150); // Match fadeOut duration
    } else {
      setIsOpen(false);
      setIsClosing(false);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen || isClosing) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isClosing, handleClose]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsClosing(false);
  };

  const handleSelect = (value: SortOption, onChangeCallback?: (value: SortOption) => void) => {
    setSelectedValue(value);
    setHoveredValue(null);
    handleClose();
    onChange?.(value);
    onChangeCallback?.(value);
  };

  return {
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
  };
}
