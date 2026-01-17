import { useRef, useState, useEffect } from "react";

type UseHorizontalScrollOptions = {
  rightPadding?: number;
  enableOverscroll?: boolean;
  overscrollAmount?: number;
  dependencies?: unknown[];
};

export function useHorizontalScroll(options: UseHorizontalScrollOptions = {}) {
  const {
    rightPadding = 24,
    enableOverscroll = false,
    overscrollAmount = 100,
    dependencies = [],
  } = options;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [transformSteps, setTransformSteps] = useState<number[]>([0]);
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const calculateTransformSteps = () => {
      const containerWidth = container.clientWidth;
      const contentWidth = content.scrollWidth;
      const maxScroll = contentWidth - containerWidth + rightPadding;

      if (maxScroll <= 0) {
        setTransformSteps([0]);
        return;
      }

      // Calculate target number of steps based on screen width
      // Large screens (>= 1280px): 4 steps
      // Medium screens (1024px-1279px): 5 steps
      // Smaller screens (768px-1023px): 6 steps
      // Below 768px: buttons are hidden, but we'll still calculate
      const screenWidth = window.innerWidth;
      let targetSteps = 4; // Default for large screens

      if (screenWidth >= 1280) {
        targetSteps = 4;
      } else if (screenWidth >= 1024) {
        targetSteps = 5;
      } else if (screenWidth >= 768) {
        targetSteps = 6;
      } else {
        // Below md, buttons are hidden, but calculate anyway
        targetSteps = 6;
      }

      // Calculate step size to evenly distribute across scrollable area
      const stepSize = maxScroll / targetSteps;

      const steps: number[] = [0];
      for (let i = 1; i <= targetSteps; i++) {
        const stepPosition = Math.round(stepSize * i);
        if (stepPosition < maxScroll) {
          steps.push(stepPosition);
        }
      }

      // Ensure max scroll is included as final step
      if (steps[steps.length - 1] < maxScroll) {
        steps.push(maxScroll);
      }

      setTransformSteps(steps);
    };

    const checkScroll = () => {
      const containerWidth = container.clientWidth;
      const contentWidth = content.scrollWidth;
      const maxScroll = contentWidth - containerWidth + rightPadding;
      const currentTranslate = Math.abs(translateX);

      setCanScrollRight(currentTranslate < maxScroll - 10);
      setCanScrollLeft(currentTranslate > 10);
    };

    const handleWheel = (e: WheelEvent) => {
      // Use deltaX for horizontal touchpad scrolling
      if (e.deltaX !== 0) {
        e.preventDefault();
        const containerWidth = container.clientWidth;
        const contentWidth = content.scrollWidth;
        const maxScroll = contentWidth - containerWidth + rightPadding;

        if (enableOverscroll) {
          const newTranslateX = Math.max(
            -maxScroll - overscrollAmount,
            Math.min(overscrollAmount, translateX - e.deltaX)
          );
          setTranslateX(newTranslateX);
        } else {
          const newTranslateX = Math.max(
            -maxScroll,
            Math.min(0, translateX - e.deltaX)
          );
          setTranslateX(newTranslateX);
        }
      }
    };

    const handleResize = () => {
      // Wait for layout to settle
      setTimeout(() => {
        calculateTransformSteps();
        checkScroll();
        // Reset position if content is smaller than container
        const containerWidth = container.clientWidth;
        const contentWidth = content.scrollWidth;
        if (contentWidth <= containerWidth) {
          setTranslateX(0);
        } else {
          // Clamp current position
          const maxScroll = contentWidth - containerWidth + rightPadding;
          setTranslateX(Math.max(-maxScroll, Math.min(0, translateX)));
        }
      }, 100);
    };

    // Wait for images to load and layout to settle
    const init = () => {
      setTimeout(() => {
        calculateTransformSteps();
        checkScroll();
      }, 100);
    };

    init();

    container.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", handleResize);

    // Recalculate when images load
    const images = content.querySelectorAll("img");
    images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", init);
      }
    });

    // Update scroll state when translateX changes
    checkScroll();

    return () => {
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
      images.forEach((img) => {
        img.removeEventListener("load", init);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translateX, rightPadding, enableOverscroll, overscrollAmount, ...dependencies]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    const content = contentRef.current;
    if (!container || !content || transformSteps.length === 0) return;

    const containerWidth = container.clientWidth;
    const contentWidth = content.scrollWidth;
    const maxScroll = contentWidth - containerWidth + rightPadding;
    const currentTranslate = Math.abs(translateX);
    let targetTranslate = currentTranslate;

    if (direction === "right") {
      // Find the next step position
      for (let i = 0; i < transformSteps.length; i++) {
        const stepPos = transformSteps[i];
        if (stepPos > currentTranslate + 10) {
          targetTranslate = stepPos;
          break;
        }
      }
      // If at the end, scroll to max
      if (targetTranslate === currentTranslate) {
        targetTranslate = maxScroll;
      }
    } else {
      // Find the previous step position
      for (let i = transformSteps.length - 1; i >= 0; i--) {
        const stepPos = transformSteps[i];
        if (stepPos < currentTranslate - 10) {
          targetTranslate = stepPos;
          break;
        }
      }
      // If at the start, scroll to 0
      if (targetTranslate === currentTranslate) {
        targetTranslate = 0;
      }
    }

    setTranslateX(-targetTranslate);
  };

  return {
    scrollContainerRef,
    contentRef,
    translateX,
    canScrollRight,
    canScrollLeft,
    scroll,
  };
}
