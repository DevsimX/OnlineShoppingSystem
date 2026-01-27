"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { MobileSheetMenuItem, MobileSheetSection } from "./types";

type HeaderMobileSheetProps = {
  isOpen: boolean;
  items: MobileSheetMenuItem[];
  /** Called when user clicks a link inside the sheet */
  onNavigate?: () => void;
};

function AccordionTrigger(props: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  iconClassName?: string;
  size?: "lg" | "sm";
}) {
  const { label, isOpen, onToggle, className, iconClassName, size = "lg" } = props;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className={
        className ??
        "flex w-full flex-1 items-center justify-between py-2 font-price-check text-xl leading-4 tracking-wide font-stretch-expanded transition-all select-none [&[data-state=open]>span>svg]:rotate-180"
      }
      data-state={isOpen ? "open" : "closed"}
    >
      <span className="w-full text-left">{label}</span>
      <span className={size === "lg" ? "hover:bg-dark-10 inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent" : "hover:bg-dark-10 inline-flex size-6 items-center justify-center rounded-[7px] bg-transparent"}>
        <ChevronDown
          className={
            [
              iconClassName ??
                (size === "lg"
                  ? "lucide-icon lucide lucide-chevron-down size-6 rounded-md bg-pop-neutral-black p-1 text-white transition-transform duration-200"
                  : "lucide-icon lucide lucide-chevron-down size-[14px] transition-transform duration-200"),
              // Smooth 0deg -> 180deg rotation (clockwise) when open
              isOpen ? "rotate-180" : "rotate-0",
            ].join(" ")
          }
        />
      </span>
    </button>
  );
}

function AnimatedHeight(props: {
  open: boolean;
  /** Unique key to re-measure content when it changes */
  depKey: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { open, depKey, className, children } = props;
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    // Measure on next frame to ensure layout is ready.
    const raf = window.requestAnimationFrame(() => {
      setHeight(el.scrollHeight);
    });
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

function MobileNestedAccordion(props: { title: string; links: Array<{ label: string; href: string; className?: string }>; onNavigate?: () => void }) {
  const { title, links, onNavigate } = props;
  const [open, setOpen] = useState(false);

  // If no title (shouldn't happen), just render links.
  if (!title) {
    return (
      <div className="py-2 pl-2">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="block py-1.5" onClick={onNavigate}>
            {l.label}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full" data-orientation="vertical" data-accordion-root="">
      <div className="group" data-state={open ? "open" : "closed"} data-orientation="vertical" data-accordion-item="">
        <div role="heading" aria-level={2} data-heading-level={2} data-state={open ? "open" : "closed"} data-orientation="vertical" data-accordion-header="">
          <AccordionTrigger
            label={title}
            isOpen={open}
            onToggle={() => setOpen((v) => !v)}
            className="flex w-full flex-1 items-center justify-between py-1.5 font-family-trade-gothic font-black tracking-wide uppercase transition-all select-none [&[data-state=open]>span>svg]:rotate-180"
            size="sm"
            iconClassName="lucide-icon lucide lucide-chevron-down size-[14px] transition-transform duration-200"
          />
        </div>
        <AnimatedHeight open={open} depKey={`${title}:${links.length}`}>
          <div className="py-2 pl-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="block py-1.5" onClick={onNavigate}>
                {l.label}
              </Link>
            ))}
          </div>
        </AnimatedHeight>
      </div>
    </div>
  );
}

function MobileSection(props: { section: MobileSheetSection; onNavigate?: () => void }) {
  const { section, onNavigate } = props;
  if (section.type === "heading") {
    return <span className={section.className ?? "block py-1.5 tracking-wide font-semibold"}>{section.label}</span>;
  }
  if (section.type === "link") {
    return (
      <Link href={section.href} className={section.className ?? "block py-1.5 tracking-wide"} onClick={onNavigate}>
        {section.label}
      </Link>
    );
  }
  // accordion
  return <MobileNestedAccordion title={section.title} links={section.links} onNavigate={onNavigate} />;
}

export function HeaderMobileSheet(props: HeaderMobileSheetProps) {
  const { isOpen, items, onNavigate } = props;
  const itemKey = useMemo(() => items.map((i) => i.label).join("|"), [items]);

  const [openTop, setOpenTop] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [sheetState, setSheetState] = useState<"open" | "closed">("closed");
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animate in/out: keep mounted briefly after close.
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
    // Optional: collapse accordions when closing
    setOpenTop({});

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

  const handleBlankClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onNavigate) return;
    const target = e.target as HTMLElement;
    // Don't close when clicking interactive elements.
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
      <div className="w-full" data-orientation="vertical" data-accordion-root="">
        {items.map((item) => {
          const isItemOpen = !!openTop[item.label];
          return (
            <div
              key={item.label}
              className="group"
              data-state={isItemOpen ? "open" : "closed"}
              data-orientation="vertical"
              data-accordion-item=""
            >
              <div
                role="heading"
                aria-level={2}
                data-heading-level={2}
                data-state={isItemOpen ? "open" : "closed"}
                data-orientation="vertical"
                data-accordion-header=""
              >
                <AccordionTrigger
                  label={item.label}
                  isOpen={isItemOpen}
                  onToggle={() =>
                    setOpenTop((prev) => ({ ...prev, [item.label]: !prev[item.label] }))
                  }
                />
              </div>

              <AnimatedHeight
                open={isItemOpen}
                depKey={`${itemKey}:${item.label}:${item.sections.length}`}
              >
                <div className="rounded-2xl border-2 border-pop-neutral-black bg-white px-4 py-2">
                  <div>
                    {item.sections.map((section, idx) => (
                      <div key={`${item.label}-${idx}`} className="w-full">
                        <MobileSection section={section} onNavigate={onNavigate} />
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedHeight>
            </div>
          );
        })}

        {/* Simple links (like your sample) */}
        <Link
          className="block py-2 font-price-check text-xl tracking-wide uppercase font-stretch-expanded"
          href="/collections/whats-hot"
          onClick={onNavigate}
        >
          {"What's Hot"}
        </Link>
        <Link
          className="block py-2 font-price-check text-xl tracking-wide uppercase font-stretch-expanded"
          href="/collections/new-stuff"
          onClick={onNavigate}
        >
          New Stuff
        </Link>
        <Link
          className="block py-2 font-price-check text-xl tracking-wide uppercase font-stretch-expanded"
          href="/products/pop-gift-card"
          onClick={onNavigate}
        >
          Gift Cards
        </Link>
        <Link
          className="block py-2 font-price-check text-xl tracking-wide uppercase font-stretch-expanded"
          href="/collections/valentines-day"
          onClick={onNavigate}
        >
          Valentine&apos;s Day
        </Link>

        <div className="mt-6 border-t-2 border-dashed border-black pt-6">
          <Link
            className="block py-2 font-ultra-bold text-lg font-extrabold uppercase"
            href="/about"
            onClick={onNavigate}
          >
            About
          </Link>
          <Link
            className="block py-2 font-ultra-bold text-lg font-extrabold uppercase"
            href="/visit"
            onClick={onNavigate}
          >
            Visit
          </Link>
        </div>
      </div>
    </div>
  );

  return createPortal(sheet, document.body);
}

