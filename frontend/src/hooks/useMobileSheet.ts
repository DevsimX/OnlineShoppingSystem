import { useEffect, useRef, useState } from "react";

/**
 * Hook to manage mobile sheet mount/unmount animation state.
 * Keeps the sheet mounted briefly after close to allow exit animation.
 */
export function useMobileSheet(isOpen: boolean) {
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [sheetState, setSheetState] = useState<"open" | "closed">("closed");
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isOpen) {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setShouldRender(true);
      setSheetState("open");
      return;
    }

    // closing
    setSheetState("closed");
    closeTimerRef.current = window.setTimeout(() => {
      setShouldRender(false);
      closeTimerRef.current = null;
    }, 220);
  }, [isOpen, mounted]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  return { mounted, shouldRender, sheetState };
}
