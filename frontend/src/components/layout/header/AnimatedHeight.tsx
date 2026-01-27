"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedHeightProps = {
  open: boolean;
  /** Unique key to re-measure content when it changes */
  depKey: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Component that animates height from 0 to content height (grow top -> bottom).
 * Uses ResizeObserver to keep height in sync when nested content changes.
 */
export function AnimatedHeight(props: AnimatedHeightProps) {
  const { open, depKey, className, children } = props;
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const measure = () => {
      setHeight(el.scrollHeight);
    };

    const raf = window.requestAnimationFrame(measure);

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => measure());
      ro.observe(el);
      return () => {
        window.cancelAnimationFrame(raf);
        ro.disconnect();
      };
    }

    return () => window.cancelAnimationFrame(raf);
  }, [depKey, open]);

  return (
    <div
      className={["mobile-accordion", className].filter(Boolean).join(" ")}
      data-state={open ? "open" : "closed"}
      style={
        {
          "--mobile-accordion-content-height": `${height}px`,
        } as React.CSSProperties
      }
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
