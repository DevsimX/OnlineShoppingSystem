import { useState } from "react";

/**
 * Hook to manage accordion open/close state for mobile sheet menu items.
 */
export function useMobileSheetAccordion() {
  const [openTop, setOpenTop] = useState<Record<string, boolean>>({});

  const toggleItem = (label: string) => {
    setOpenTop((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isItemOpen = (label: string) => !!openTop[label];

  const closeAll = () => {
    setOpenTop({});
  };

  return { openTop, toggleItem, isItemOpen, closeAll };
}
