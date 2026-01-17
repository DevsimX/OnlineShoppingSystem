"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/assets/logo.svg";
import Menu from "@/assets/menu.svg";
import Search from "@/assets/search.svg"
import MyAccount from "@/assets/account.svg"
import Cart from "@/assets/cart.svg"
import { ChevronDown } from "lucide-react"
import { isAuthenticated } from "@/lib/api/auth";

type DropdownSection = {
  type: "category" | "standalone";
  header?: { label: string; href?: string };
  links: Array<{ label: string; href: string; className?: string }>;
};

type DropdownMenuItem = {
  label: string;
  items: DropdownSection[];
};

type NavLinkItem = {
  label: string;
  href: string;
};

export default function Header() {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [displayedDropdown, setDisplayedDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleAccountClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isAuthenticated()) {
      router.push("/dashboard");
    } else {
      router.push("/auth");
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isClickInsideDropdown = dropdownRef.current?.contains(target);
      const isClickOnAnyButton = Object.values(buttonRefs.current).some(
        (ref) => ref?.contains(target)
      );

      if (!isClickInsideDropdown && !isClickOnAnyButton) {
        setActiveDropdown(null);
      }
    }

    if (activeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  // Handle displayed dropdown for animation
  useEffect(() => {
    if (activeDropdown) {
      // Opening: show immediately
      setDisplayedDropdown(activeDropdown);
    } else {
      // Closing: delay hiding to allow animation
      const timer = setTimeout(() => {
        setDisplayedDropdown(null);
      }, 300); // Match CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [activeDropdown]);

  // Dropdown menu items (Shop, Brands, Gifts)
  const dropdownMenuItems: DropdownMenuItem[] = [
    {
      label: "Shop",
      items: [
        {
          type: "category",
          header: { label: "Gifts", href: "/collections/gifts" },
          links: [
            { label: "Gift Boxes", href: "/collections/gift-boxes" },
            { label: "Gift Cards", href: "/products/pop-gift-card" },
            { label: "Gifts Under $10", href: "/collections/gifts-under-10" },
            { label: "Gifts Under $25", href: "/collections/gifts-under-25" },
            { label: "Gifts Under $50", href: "/collections/gifts-under-50" },
            { label: "Gifts Under $100", href: "/collections/gifts-under-100" },
            { label: "Gifts For Men", href: "/collections/gifts-for-men" },
            { label: "Gifts For Women", href: "/collections/gifts-for-women" },
            { label: "Gifts For Kids", href: "/collections/gifts-for-kids" },
            { label: "Unique Gifts", href: "/collections/unique-gifts" },
            { label: "Corporate Gifts", href: "/collections/corporate-gifting" },
          ],
        },
        {
          type: "standalone",
          links: [{ label: "What's Hot", href: "/collections/whats-hot" }],
        },
        {
          type: "standalone",
          links: [{ label: "New Stuff", href: "/collections/new-stuff" }],
        },
        {
          type: "category",
          header: { label: "Food & Drinks", href: "/collections/food-drinks" },
          links: [
            { label: "Beer, Wine & Spirits", href: "/collections/beer-wine-spirits" },
            { label: "Non-Alc Drinks", href: "/collections/non-alcoholic-drinks" },
            { label: "Confectionary", href: "/collections/sweet-treats" },
            { label: "Snacks", href: "/collections/snacks" },
            { label: "Coffee & Tea", href: "/collections/coffee-tea" },
            { label: "Cooking & Condiments", href: "/collections/cooking-condiments" },
          ],
        },
        {
          type: "category",
          header: { label: "Fashion", href: "/collections/fashion" },
          links: [
            { label: "Accessories", href: "/collections/accessories" },
            { label: "Jewellery", href: "/collections/jewellery" },
          ],
        },
        {
          type: "category",
          header: { label: "Body", href: "/collections/body" },
          links: [
            { label: "Skincare", href: "/collections/skincare" },
            { label: "Bath", href: "/collections/bath" },
            { label: "Beauty & Fragrance", href: "/collections/beauty-fragrances" },
          ],
        },
        {
          type: "category",
          header: { label: "Stationery", href: "/collections/stationery" },
          links: [
            { label: "Greeting Cards", href: "/collections/greeting-cards" },
            { label: "Stickers & Stationery", href: "/collections/stationery" },
            { label: "Games", href: "/collections/games" },
            { label: "Kids Toys", href: "/collections/kids-toys" },
          ],
        },
        {
          type: "category",
          header: { label: "Memorabilia", href: "/collections/memorabilia" },
          links: [
            { label: "Canberra Merch", href: "/collections/canberra-merch" },
            { label: "POP Merch", href: "/collections/pop-merch" },
          ],
        },
        {
          type: "category",
          header: { label: "Home", href: "/collections/home" },
          links: [
            { label: "Candles & Diffusers", href: "/collections/candles-diffusers" },
            { label: "Ceramics & Tableware", href: "/collections/ceramics-tableware" },
            { label: "Prints", href: "/collections/prints" },
            { label: "Books", href: "/collections/books" },
            { label: "Pet Goods", href: "/collections/pet-goods" },
          ],
        },
      ],
    },
    {
      label: "Brands",
      items: [
        {
          type: "category",
          header: { label: "Featured Brands" },
          links: [
            { label: "Allara Creative", href: "/collections/allara-creative" },
            { label: "Bakers Wanna Bake", href: "/collections/bakers-wanna-bake" },
            { label: "Bearlymade", href: "/collections/bearlymade" },
            { label: "Burley & Brave", href: "/collections/burley-brave" },
            { label: "Contentious Character Winery", href: "/collections/contentious-character-winery" },
            { label: "Cygnet & Pen", href: "/collections/cygnet-and-pen" },
            { label: "Jasper & Myrtle", href: "/collections/jasper-myrtle-chocolates" },
            { label: "Kate's Bombs", href: "/collections/kates-bombs" },
            { label: "KOKOArtisan", href: "/collections/kokoartisan" },
            { label: "La Source Australia", href: "/collections/la-source" },
            { label: "Leafy Sea Dragon", href: "/collections/leafy-sea-dragon" },
            { label: "North/South Print Shop", href: "/collections/north-south-print-shop" },
            { label: "Poncho Fox", href: "/collections/poncho-fox" },
            { label: "Trevor Dickinson Art", href: "/collections/trevor-dickinson-art" },
            { label: "Zealous & Co.", href: "/collections/zealous-co" },
          ],
        },
      ],
    },
    {
      label: "Gifts",
      items: [
        {
          type: "standalone",
          links: [{ label: "Gifts Under $10", href: "/collections/gifts-under-10", className: "font-ultra-bold font-black uppercase" }],
        },
        {
          type: "standalone",
          links: [{ label: "Gifts Under $25", href: "/collections/gifts-under-25", className: "font-ultra-bold font-black uppercase" }],
        },
        {
          type: "standalone",
          links: [{ label: "Gifts Under $50", href: "/collections/gifts-under-50", className: "font-ultra-bold font-black uppercase" }],
        },
        {
          type: "standalone",
          links: [{ label: "Gifts Under $100", href: "/collections/gifts-under-100", className: "font-ultra-bold font-black uppercase" }],
        },
        {
          type: "standalone",
          links: [{ label: "Gift Boxes", href: "/collections/gift-boxes" }],
        },
        {
          type: "standalone",
          links: [{ label: "Gifts For Men", href: "/collections/gifts-for-men" }],
        },
        {
          type: "standalone",
          links: [{ label: "Gifts For Women", href: "/collections/gifts-for-women" }],
        },
        {
          type: "standalone",
          links: [{ label: "Gifts For Kids", href: "/collections/gifts-for-kids" }],
        },
        {
          type: "standalone",
          links: [{ label: "Gift Cards", href: "/products/pop-gift-card" }],
        },
        {
          type: "standalone",
          links: [{ label: "Unique Gifts", href: "/collections/unique-gifts" }],
        },
        {
          type: "standalone",
          links: [{ label: "Corporate Gifts", href: "/collections/corporate-gifting" }],
        },
      ],
    },
  ];

  // Simple navigation links
  const navLinkItems: NavLinkItem[] = [
    {
      label: "What's Hot",
      href: "/collections/whats-hot",
    },
    {
      label: "New Stuff",
      href: "/collections/new-stuff",
    },
    {
      label: "Gift Cards",
      href: "/products/pop-gift-card",
    },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full bg-[var(--background)] max-w-[1533px] left-1/2 -translate-x-1/2">
      {/* Main Navigation */}
      <div className="flex w-full items-center justify-between gap-6 px-3 py-3 max-md:flex-wrap max-md:gap-y-0 max-md:border-b-2 md:px-6 md:py-2 lg:items-start lg:gap-12 lg:pt-3.5 lg:pb-0">
        {/* Mobile Menu Button */}
        <div className="flex flex-1 items-center gap-2 max-md:justify-start md:hidden">
          <button className="IconMenu">
            <Menu />
            <span className="sr-only">Open Menu</span>
          </button>
        </div>

        {/* Logo */}
        <div className="relative z-10 transition-all delay-100 max-md:flex-shrink-0">
          <Link href="/">
            <span className="sr-only">Go Home</span>
            <div className="h-auto w-full transition-all max-lg:max-w-[100px] lg:w-[135px] xl:w-[200px]">
              <div className="logo-container">
                <Logo />
              </div>
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative w-full flex-1 shrink-0 max-md:order-last max-md:mt-3 max-md:block max-md:basis-1/1 md:max-w-[720px]">
          <input
            id="search"
            type="text"
            placeholder="What are you looking for?"
            className="h-12 w-full bg-white items-center rounded-full border-2 border-black pl-16 shadow-[2px_2px_0px_0px_#000] focus:ring-0 focus:outline-none sm:text-lg"
            style={{ touchAction: "manipulation" }}
          />
          <Search />
        </div>

        {/* Navigation Links & Icons */}
        <div className="flex items-center gap-6 text-lg tracking-wide uppercase max-md:flex-1 max-md:justify-end lg:pt-2 ">
          {/* Desktop Navigation Links */}
          <a href="/about" className="font-extrabold hover:text-[var(--pop-red)] max-md:hidden">
            About
          </a>
          <a href="/visit" className="font-extrabold hover:text-[var(--pop-red)] max-md:hidden">
            Visit
          </a>

          {/* Icons */}
          <div className="flex gap-2 md:gap-3">
            {/* User Account Icon */}
            <a 
              href={isAuthenticated() ? "/dashboard" : "/auth"} 
              onClick={handleAccountClick}
              className="IconMenu" 
              aria-label="Go to your account"
            >
              <span className="sr-only">Go to your account</span>
              <MyAccount />
            </a>

            {/* Cart Icon */}
            <button className="IconMenu cursor-pointer" aria-label="Open Cart">
              <span className="sr-only">Open Cart</span>
              <Cart />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="bg-black xl:-mt-8">
        <div className="relative">
          <div className="flex h-12 items-end justify-center gap-6 max-md:hidden">
            {/* Dropdown Menu Items */}
            {dropdownMenuItems.map((item) => (
              <div
                key={item.label}
                className="relative"
              >
                <button
                  ref={(el) => {
                    buttonRefs.current[item.label] = el;
                  }}
                  className="nav-menu-button"
                  onClick={() => {
                    const isActive = activeDropdown === item.label.toLowerCase();
                    setActiveDropdown(isActive ? null : item.label.toLowerCase());
                  }}
                >
                  {item.label}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === item.label.toLowerCase() ? "rotate-180" : ""
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
            className={`dropdown-menu-container w-full bg-[var(--pop-yellow-mid)] ${activeDropdown ? "dropdown-menu-open" : "dropdown-menu-closed"
              }`}
            onClick={(e) => {
              const target = e.target as HTMLElement;
              // Close dropdown if clicking on empty space (not on links or interactive elements)
              // Check if the click is on an anchor tag or inside an anchor tag
              const isClickOnLink = target.closest('a') !== null;
              
              // Only close if NOT clicking on a link
              if (!isClickOnLink) {
                setActiveDropdown(null);
              }
            }}
          >
            <div className="dropdown-menu-content-wrapper">
              {(() => {
                if (!displayedDropdown) return null;
                const activeItem = dropdownMenuItems.find(
                  (item) => item.label.toLowerCase() === displayedDropdown
                );
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
                                className={`block space-y-1 hover:text-[var(--pop-red)] ${section.links[0].className || ""}`}
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
                                  className={`block space-y-1 hover:text-[var(--pop-red)] ${link.className || ""}`}
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
    </nav>
  );
}
