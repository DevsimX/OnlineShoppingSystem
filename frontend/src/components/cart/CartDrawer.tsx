"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import BigCart from "@/assets/bigcart.svg";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  // Prevent body scroll when cart is open
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
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:duration-500 data-[state=open]:fade-in-0"
        data-dialog-overlay=""
        data-state={isOpen ? "open" : "closed"}
        onClick={onClose}
        style={{ pointerEvents: "auto" }}
      />

      {/* Side Drawer */}
      <div
        className="fixed top-0 right-0 z-[99999] h-full w-full border-l-2 border-black bg-[var(--pop-yellow-light)] shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:duration-500 data-[state=open]:slide-in-from-right lg:w-[400px]"
        role="dialog"
        aria-modal="true"
        data-dialog-content=""
        tabIndex={-1}
        data-state={isOpen ? "open" : "closed"}
        style={{ pointerEvents: "auto", userSelect: "text" }}
      >
        <div className="h-full">
          <div className="flex h-full flex-col justify-between py-4">
            {/* Header */}
            <div className="flex w-full items-start justify-between border-b-2 px-6 pb-2 sm:pb-4">
              <div>
                <h2 className="font-reika-script text-3xl">My Cart</h2>
              </div>
              <button
                className="IconMenu"
                onClick={onClose}
                tabIndex={0}
                data-state={isOpen ? "open" : "closed"}
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Empty Cart Content */}
            <div className="mt-auto flex w-full flex-col items-center justify-center overflow-hidden">
              <BigCart />
              <div className="mt-6 text-center font-price-check text-2xl font-stretch-expanded">
                Your basket is empty
              </div>
            </div>

            {/* Footer Button */}
            <div className="mt-auto space-y-4 border-t-2 px-6 pt-3 md:pt-6">
              <button
                onClick={onClose}
                className="flex items-center justify-center uppercase tracking-wide font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-[var(--pop-red-accent)] text-white hover:bg-[var(--pop-teal-mid)] border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-12 px-6 py-2 text-lg md:text-xl rounded-full w-full"
              >
                Continue shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
