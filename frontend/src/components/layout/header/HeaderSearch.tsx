"use client";

import Search from "@/assets/search.svg";
import SearchDropdown from "@/components/search/SearchDropdown";

type HeaderSearchProps = {
  searchQuery: string;
  isSearchOpen: boolean;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  /** When false, hide the search bar on < md screens. */
  mobileVisible?: boolean;
  onChange: (value: string) => void;
  onFocus: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClose: () => void;
};

export function HeaderSearch(props: HeaderSearchProps) {
  const {
    searchQuery,
    isSearchOpen,
    searchInputRef,
    mobileVisible = true,
    onChange,
    onFocus,
    onKeyDown,
    onClose,
  } = props;

  return (
    <div
      className={[
        "relative w-full flex-1 shrink-0 md:max-w-[720px]",
        // Mobile behavior: animate open/close vertically (no opacity).
        "max-md:order-last max-md:basis-1/1 max-md:overflow-hidden max-md:origin-top",
        "max-md:transition-[max-height,transform,margin] max-md:duration-200 max-md:ease-in-out",
        mobileVisible ? "max-md:mt-3 max-md:max-h-[120px] max-md:scale-y-100" : "max-md:mt-0 max-md:max-h-0 max-md:scale-y-0 max-md:pointer-events-none",
      ].join(" ")}
    >
      <input
        ref={searchInputRef}
        id="search"
        type="text"
        placeholder="What are you looking for?"
        value={searchQuery}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        className="h-12 w-full bg-white items-center rounded-full border-2 border-black pl-16 shadow-[2px_2px_0px_0px_#000] focus:ring-0 focus:outline-none sm:text-lg"
        style={{ touchAction: "manipulation" }}
      />
      <Search />
      <SearchDropdown query={searchQuery} isOpen={isSearchOpen} onClose={onClose} />
    </div>
  );
}

