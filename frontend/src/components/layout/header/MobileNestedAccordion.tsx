"use client";

import { useState } from "react";
import Link from "next/link";
import { AccordionTrigger } from "./AccordionTrigger";

type MobileNestedAccordionProps = {
  title: string;
  links: Array<{ label: string; href: string; className?: string }>;
  onNavigate?: () => void;
};

export function MobileNestedAccordion(props: MobileNestedAccordionProps) {
  const { title, links, onNavigate } = props;
  const [open, setOpen] = useState(false);

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
        <div hidden={!open}>
          <div className="py-2 pl-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="block py-1.5" onClick={onNavigate}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
