"use client";

import { useEffect } from "react";

type DialogOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function DialogOverlay({ isOpen, onClose }: DialogOverlayProps) {
  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup: restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:duration-500 data-[state=open]:fade-in-0"
      data-dialog-overlay=""
      data-state={isOpen ? "open" : "closed"}
      onClick={onClose}
      style={{ pointerEvents: "auto" }}
    />
  );
}
