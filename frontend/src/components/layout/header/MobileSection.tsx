import Link from "next/link";
import type { MobileSheetSection } from "./types";
import { MobileNestedAccordion } from "./MobileNestedAccordion";

type MobileSectionProps = {
  section: MobileSheetSection;
  onNavigate?: () => void;
};

export function MobileSection(props: MobileSectionProps) {
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
  
  return <MobileNestedAccordion title={section.title} links={section.links} onNavigate={onNavigate} />;
}
