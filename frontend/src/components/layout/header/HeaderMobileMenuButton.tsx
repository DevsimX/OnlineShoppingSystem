"use client";

import { Menu, Search, X } from "lucide-react";

type HeaderMobileMenuButtonProps = {
  isOpen: boolean;
  onToggleMenu: () => void;
  onToggleSearch: () => void;
};

export function HeaderMobileMenuButton(props: HeaderMobileMenuButtonProps) {
  const { isOpen, onToggleMenu, onToggleSearch } = props;

  return (
    <div className="flex flex-1 items-center gap-2 max-md:justify-start md:hidden">
      <button className="IconMenu" onClick={onToggleMenu}>
        {isOpen ? <X className="lucide-icon" width={20} height={20} /> : <Menu className="lucide-icon" width={20} height={20} />}
        <span className="sr-only">{isOpen ? "Close Menu" : "Open Menu"}</span>
      </button>
      {/* Mobile rule: search icon is hidden by default; shown when menu is open */}
      {isOpen && (
        <button className="IconMenu" onClick={onToggleSearch} aria-label="Search">
          <Search className="lucide-icon lucide-search" width={20} height={20} />
        </button>
      )}
    </div>
  );
}

