"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { dropdownMenuItems, mobileSheetMenuItems, navLinkItems } from "@/components/layout/header/navData";
import { HeaderActions } from "@/components/layout/header/HeaderActions";
import { HeaderLogo } from "@/components/layout/header/HeaderLogo";
import { HeaderMobileMenuButton } from "@/components/layout/header/HeaderMobileMenuButton";
import { HeaderSearch } from "@/components/layout/header/HeaderSearch";
import { HeaderSecondaryNav } from "@/components/layout/header/HeaderSecondaryNav";
import { HeaderMobileSheet } from "@/components/layout/header/HeaderMobileSheet";
import { useHeaderAuth } from "@/hooks/useHeaderAuth";
import { useHeaderDropdown } from "@/hooks/useHeaderDropdown";
import { useHeaderSearch } from "@/hooks/useHeaderSearch";
import { useHeaderMobileMenu } from "@/hooks/useHeaderMobileMenu";

export default function Header() {
  const router = useRouter();
  const { openCart, cartItemCount } = useCart();
  const auth = useHeaderAuth(router);
  const search = useHeaderSearch(router);
  const dropdown = useHeaderDropdown();
  const mobileMenu = useHeaderMobileMenu();

  const closeMobileMenu = () => {
    mobileMenu.closeMobileMenu();
  };

  const handleToggleMobileMenu = () => {
    const wasOpen = mobileMenu.isMobileMenuOpen;
    mobileMenu.toggleMobileMenu();
    // When opening the menu on mobile, hide the search input and dropdown.
    if (!wasOpen) {
      search.closeMobileSearch();
    }
  };

  // Mobile behavior:
  // - default: show search input
  // - when menu open: hide search input, show search icon (handled in HeaderMobileMenuButton)
  const mobileSearchVisible = !mobileMenu.isMobileMenuOpen;

  const handleMobileBlankClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!mobileMenu.isMobileMenuOpen) return;
    const target = e.target as HTMLElement;

    // Don't close when clicking interactive elements.
    if (target.closest("button, a, input, textarea, select, [role='button']")) return;

    closeMobileMenu();
  };

  return (
    <nav
      className="fixed top-0 z-50 w-full max-w-[1533px] left-1/2 -translate-x-1/2"
      onClick={handleMobileBlankClick}
    >
      {/* Main Navigation */}
      <div className="flex w-full items-center justify-between gap-6 bg-pop-yellow-light px-3 py-3 max-md:flex-wrap max-md:gap-y-0 max-md:border-b-2 md:bg-[var(--background)] md:px-6 md:py-2 lg:items-start lg:gap-12 lg:pt-3.5 lg:pb-0">
        {/* Mobile Menu Button */}
        <HeaderMobileMenuButton
          isOpen={mobileMenu.isMobileMenuOpen}
          onToggleMenu={handleToggleMobileMenu}
          // Requirement: search icon behaves same as close icon when visible (menu open)
          onToggleSearch={closeMobileMenu}
        />

        {/* Logo */}
        <HeaderLogo />

        {/* Search Bar */}
        <HeaderSearch
          searchQuery={search.searchQuery}
          isSearchOpen={search.isSearchOpen}
          searchInputRef={search.searchInputRef}
          mobileVisible={mobileSearchVisible}
          onChange={search.handleSearchChange}
          onFocus={search.handleSearchFocus}
          onKeyDown={search.handleSearchKeyDown}
          onClose={search.closeSearch}
        />

        {/* Navigation Links & Icons */}
        <HeaderActions
          accountHref={auth.accountHref}
          onAccountClick={auth.handleAccountClick}
          onOpenCart={openCart}
          cartItemCount={cartItemCount}
        />
      </div>

      {/* Mobile sheet menu (only shown when menu is open, < md) */}
      <HeaderMobileSheet
        isOpen={mobileMenu.isMobileMenuOpen}
        items={mobileSheetMenuItems}
        onNavigate={closeMobileMenu}
      />

      {/* Secondary Navigation */}
      <HeaderSecondaryNav
        dropdownMenuItems={dropdownMenuItems}
        navLinkItems={navLinkItems}
        activeDropdown={dropdown.activeDropdown}
        displayedDropdown={dropdown.displayedDropdown}
        toggleDropdown={dropdown.toggleDropdown}
        setButtonRef={dropdown.setButtonRef}
        dropdownRef={dropdown.dropdownRef}
        onDropdownContainerClick={dropdown.handleDropdownContainerClick}
      />
    </nav>
  );
}
