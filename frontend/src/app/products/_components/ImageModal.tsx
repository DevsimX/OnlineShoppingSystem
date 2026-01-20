"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import ImageSkeleton from "@/components/common/ImageSkeleton";

type ImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
  isLoading: boolean;
  onImageLoad: () => void;
};

export default function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  alt,
  isLoading,
  onImageLoad,
}: ImageModalProps) {
  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save the current scroll position
      const scrollY = window.scrollY;
      // Disable scrolling
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        // Re-enable scrolling
        const scrollY = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || "0") * -1);
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/80"
        onClick={onClose}
        style={{ pointerEvents: "auto" }}
      />
      <div
        className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 border-none bg-transparent p-0 shadow-none outline-none"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{ pointerEvents: "auto", userSelect: "text" }}
      >
        {imageUrl && (
          <>
            <img
              className={`max-h-[90vh] !max-w-[90vw] rounded-xl object-contain ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
              src={imageUrl}
              alt={alt}
              onLoad={onImageLoad}
              style={{ display: "block" }}
            />
            {isLoading && (
              <div className="absolute inset-0 z-[60] flex items-center justify-center">
                <ImageSkeleton 
                  className="max-h-[90vh] max-w-[90vw]" 
                  rounded={true}
                />
              </div>
            )}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 rounded-full border-2 border-white p-2 text-white hover:bg-white hover:text-black transition-colors"
              tabIndex={0}
              aria-label="Close image modal"
            >
              <X className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </>
  );
}
