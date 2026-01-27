"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { MobileSheetMenuItem } from "./types";
import { useMobileSheet } from "@/hooks/useMobileSheet";
import { useMobileSheetAccordion } from "@/hooks/useMobileSheetAccordion";
import { MobileSheetContent } from "./MobileSheetContent";

type HeaderMobileSheetProps = {
  isOpen: boolean;
  items: MobileSheetMenuItem[];
  /** Called when user clicks a link inside the sheet */
  onNavigate?: () => void;
};

export function HeaderMobileSheet(props: HeaderMobileSheetProps) {
  const { isOpen, items, onNavigate } = props;
  const { mounted, shouldRender, sheetState } = useMobileSheet(isOpen);
  const { openTop, toggleItem, closeAll } = useMobileSheetAccordion();

  // Close all accordions when sheet closes
  useEffect(() => {
    if (!isOpen) {
      closeAll();
    }
  }, [isOpen, closeAll]);

  const handleBlankClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onNavigate) return;
    const target = e.target as HTMLElement;
    if (target.closest("button, a, input, textarea, select, [role='button']")) return;
    onNavigate();
  };

  if (!mounted || !shouldRender) return null;

  const sheet = (
    <div
      data-slot="sheet-content"
      className="mobile-sheet fixed top-[60px] right-0 z-30 h-full w-full overflow-auto bg-pop-yellow-mid px-6 pt-6 pb-24 shadow-lg md:hidden"
      role="dialog"
      aria-modal="true"
      data-dialog-content=""
      tabIndex={-1}
      data-state={sheetState}
      style={{ pointerEvents: "auto", userSelect: "text" }}
      onClick={handleBlankClick}
    >
      <MobileSheetContent items={items} openTop={openTop} onToggleItem={toggleItem} onNavigate={onNavigate} />
    </div>
  );

  return createPortal(sheet, document.body);
}

