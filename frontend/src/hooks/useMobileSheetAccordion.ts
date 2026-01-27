import { useCallback, useState } from "react";

/**
 * Hook to manage accordion open/close state for mobile sheet menu items.
 */
export function useMobileSheetAccordion() {
  const [openTop, setOpenTop] = useState<Record<string, boolean>>({});

  const toggleItem = useCallback((label: string) => {
    setOpenTop((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  const isItemOpen = useCallback((label: string) => !!openTop[label], [openTop]);

  const closeAll = useCallback(() => {
    setOpenTop({});
  }, []);

  return { openTop, toggleItem, isItemOpen, closeAll };
}
