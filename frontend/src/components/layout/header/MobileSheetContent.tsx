import Link from "next/link";
import { useMemo } from "react";
import type { MobileSheetMenuItem } from "./types";
import { AccordionTrigger } from "./AccordionTrigger";
import { AnimatedHeight } from "./AnimatedHeight";
import { MobileSection } from "./MobileSection";

type MobileSheetContentProps = {
  items: MobileSheetMenuItem[];
  openTop: Record<string, boolean>;
  onToggleItem: (label: string) => void;
  onNavigate?: () => void;
};

export function MobileSheetContent(props: MobileSheetContentProps) {
  const { items, openTop, onToggleItem, onNavigate } = props;
  const itemKey = useMemo(() => items.map((i) => i.label).join("|"), [items]);

  return (
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
                onToggle={() => onToggleItem(item.label)}
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

      {/* Simple links */}
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
  );
}
