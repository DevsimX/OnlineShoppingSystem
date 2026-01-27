"use client";

import { Fragment } from "react";
import { ChevronDown } from "lucide-react";
import type { DropdownMenuItem, NavLinkItem } from "./types";

type HeaderSecondaryNavProps = {
  dropdownMenuItems: DropdownMenuItem[];
  navLinkItems: NavLinkItem[];
  activeDropdown: string | null;
  displayedDropdown: string | null;
  toggleDropdown: (label: string) => void;
  setButtonRef: (key: string) => (el: HTMLButtonElement | null) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  onDropdownContainerClick: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export function HeaderSecondaryNav(props: HeaderSecondaryNavProps) {
  const {
    dropdownMenuItems,
    navLinkItems,
    activeDropdown,
    displayedDropdown,
    toggleDropdown,
    setButtonRef,
    dropdownRef,
    onDropdownContainerClick,
  } = props;

  const activeItem = displayedDropdown
    ? dropdownMenuItems.find((item) => item.label.toLowerCase() === displayedDropdown)
    : null;

  return (
    <div className="bg-black xl:-mt-8">
      <div className="relative">
        <div className="flex h-12 items-end justify-center gap-6 max-md:hidden">
          {/* Dropdown Menu Items */}
          {dropdownMenuItems.map((item) => (
            <div key={item.label} className="relative">
              <button
                ref={setButtonRef(item.label)}
                className="nav-menu-button"
                onClick={() => toggleDropdown(item.label)}
              >
                {item.label}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    activeDropdown === item.label.toLowerCase() ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          ))}

          {/* Navigation Links */}
          {navLinkItems.map((item) => (
            <div key={item.href} className="relative">
              <div className="nav-menu-link-wrapper">
                <a href={item.href} className="nav-menu-link">
                  {item.label}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Dropdown Menu */}
        <div
          ref={dropdownRef}
          className={`dropdown-menu-container w-full bg-[var(--pop-yellow-mid)] ${
            activeDropdown ? "dropdown-menu-open" : "dropdown-menu-closed"
          }`}
          onClick={onDropdownContainerClick}
        >
          <div className="dropdown-menu-content-wrapper">
            {(() => {
              if (!displayedDropdown) return null;
              if (!activeItem || activeItem.items.length === 0) return null;

              return (
                <div key={displayedDropdown} className="w-full border-b-2 border-black lg:min-h-52">
                  <div className="mx-auto max-w-5xl columns-3 p-4 text-lg">
                    {activeItem.items.map((section, index) => {
                      if (section.type === "standalone") {
                        return (
                          <div key={index} className="break-inside-avoid py-1">
                            <a
                              href={section.links[0].href}
                              className={`block space-y-1 hover:text-[var(--pop-red)] ${
                                section.links[0].className || ""
                              }`}
                            >
                              {section.links[0].label}
                            </a>
                          </div>
                        );
                      }

                      // Category type
                      return (
                        <Fragment key={index}>
                          {section.header && (
                            <div className="break-inside-avoid py-1">
                              {section.header.href ? (
                                <a
                                  href={section.header.href}
                                  className="font-ultra-bold uppercase hover:text-[var(--pop-red)]"
                                >
                                  {section.header.label}
                                </a>
                              ) : (
                                <span className="block space-y-1 font-semibold">
                                  {section.header.label}
                                </span>
                              )}
                            </div>
                          )}
                          {section.links.map((link) => (
                            <div key={link.href} className="break-inside-avoid py-1">
                              <a
                                href={link.href}
                                className={`block space-y-1 hover:text-[var(--pop-red)] ${
                                  link.className || ""
                                }`}
                              >
                                {link.label}
                              </a>
                            </div>
                          ))}
                        </Fragment>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

