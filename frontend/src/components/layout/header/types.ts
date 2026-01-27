export type DropdownSection = {
  type: "category" | "standalone";
  header?: { label: string; href?: string };
  links: Array<{ label: string; href: string; className?: string }>;
};

export type DropdownMenuItem = {
  label: string;
  items: DropdownSection[];
};

export type NavLinkItem = {
  label: string;
  href: string;
};

// Mobile sheet (different structure from desktop dropdowns)
export type MobileSheetLink = { label: string; href: string; className?: string };

export type MobileSheetSection =
  | { type: "accordion"; title: string; links: MobileSheetLink[] }
  | { type: "link"; label: string; href: string; className?: string }
  | { type: "heading"; label: string; className?: string };

export type MobileSheetMenuItem = {
  label: string;
  sections: MobileSheetSection[];
};

