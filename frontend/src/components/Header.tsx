"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "@/assets/logo.svg";
import Menu from "@/assets/menu.svg";
import Search from "@/assets/search.svg"
import MyAccount from "@/assets/account.svg"
import Cart from "@/assets/cart.svg"
import { ChevronDown } from "lucide-react"

type DropdownMenuItem = {
  label: string;
  href?: string;
  // Placeholder for dropdown menu items/submenu
  items?: Array<{ label: string; href: string }>;
};

type NavLinkItem = {
  label: string;
  href: string;
};

type ShopDropdownSection = {
  type: "category" | "standalone";
  header?: { label: string; href: string };
  links: Array<{ label: string; href: string }>;
};

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isClickInsideDropdown = dropdownRef.current?.contains(target);
      const isClickOnButton = buttonRef.current?.contains(target);
      
      if (!isClickInsideDropdown && !isClickOnButton) {
        setActiveDropdown(null);
      }
    }

    if (activeDropdown === "shop") {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  // Shop dropdown menu content
  const shopDropdownContent: ShopDropdownSection[] = [
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
  ];

  // Dropdown menu items (Shop, Brands, Gifts)
  const dropdownMenuItems: DropdownMenuItem[] = [
    {
      label: "Shop",
      // items: [] // Placeholder for dropdown submenu items
    },
    {
      label: "Brands",
      // items: [] // Placeholder for dropdown submenu items
    },
    {
      label: "Gifts",
      // items: [] // Placeholder for dropdown submenu items
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
                <Logo/>
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
        <div className="flex items-center gap-6 text-lg tracking-wide uppercase max-md:flex-1 max-md:justify-end lg:pt-2 font-family-trade-gothic">
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
            <a href="/auth/login" className="IconMenu" aria-label="Go to your account">
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
          <div className="flex h-12 items-end justify-center gap-6 max-sm:hidden">
            {/* Dropdown Menu Items */}
            {dropdownMenuItems.map((item) => (
              <div
                key={item.label}
                className="relative"
              >
                <button
                  ref={item.label === "Shop" ? buttonRef : null}
                  className="nav-menu-button"
                  onClick={() => {
                    if (item.label === "Shop") {
                      setActiveDropdown(activeDropdown === "shop" ? null : "shop");
                    }
                  }}
                >
                  {item.label}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      activeDropdown === "shop" && item.label === "Shop"
                        ? "rotate-180"
                        : ""
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

          {/* Shop Dropdown Menu (mount/unmount like Poplocal) */}
          {activeDropdown === "shop" && (
            <div ref={dropdownRef} className="w-full bg-[var(--pop-yellow-mid)]">
              <div className="mx-auto max-w-5xl columns-3 p-4 text-lg">
                {shopDropdownContent.map((section, index) => {
                  if (section.type === "standalone") {
                    return (
                      <div key={index} className="break-inside-avoid py-1">
                        <a
                          href={section.links[0].href}
                          className="block space-y-1 hover:text-[var(--pop-red)] font-family-trade-gothic font-black uppercase"
                        >
                          {section.links[0].label}
                        </a>
                      </div>
                    );
                  }
                  return (
                    <div key={index} className="flex break-inside-avoid flex-col gap-2 pb-6">
                      {section.header && (
                        <a
                          href={section.header.href}
                          className="font-family-trade-gothic font-extrabold uppercase hover:text-[var(--pop-red)]"
                        >
                          {section.header.label}
                        </a>
                      )}
                      {section.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          className="hover:text-[var(--pop-red)]"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
