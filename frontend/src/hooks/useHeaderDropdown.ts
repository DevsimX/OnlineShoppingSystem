import { useEffect, useRef, useState } from "react";

export function useHeaderDropdown() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [displayedDropdown, setDisplayedDropdown] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isClickInsideDropdown = dropdownRef.current?.contains(target);
      const isClickOnAnyButton = Object.values(buttonRefs.current).some((ref) =>
        ref?.contains(target),
      );

      if (!isClickInsideDropdown && !isClickOnAnyButton) {
        setActiveDropdown(null);
      }
    }

    if (activeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  // Handle displayed dropdown for animation
  useEffect(() => {
    if (activeDropdown) {
      // Opening: show immediately
      setDisplayedDropdown(activeDropdown);
    } else {
      // Closing: delay hiding to allow animation
      const timer = setTimeout(() => {
        setDisplayedDropdown(null);
      }, 300); // Match CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [activeDropdown]);

  const setButtonRef = (key: string) => (el: HTMLButtonElement | null) => {
    buttonRefs.current[key] = el;
  };

  const toggleDropdown = (label: string) => {
    const lower = label.toLowerCase();
    const isActive = activeDropdown === lower;
    setActiveDropdown(isActive ? null : lower);
  };

  const handleDropdownContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const isClickOnLink = target.closest("a") !== null;
    if (!isClickOnLink) {
      setActiveDropdown(null);
    }
  };

  return {
    activeDropdown,
    displayedDropdown,
    setActiveDropdown,
    toggleDropdown,
    dropdownRef,
    setButtonRef,
    handleDropdownContainerClick,
  };
}

