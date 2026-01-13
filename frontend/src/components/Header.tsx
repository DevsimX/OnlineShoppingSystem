import Logo from "@/assets/logo.svg";
import Menu from "@/assets/menu.svg";
import Search from "@/assets/search.svg"
import MyAccount from "@/assets/account.svg"
import Cart from "@/assets/cart.svg"
import DownArrow from "@/assets/downarrow.svg"
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

export default function Header() {
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
          <a href="/">
            <span className="sr-only">Go Home</span>
            <div className="h-auto w-full transition-all max-lg:max-w-[100px] lg:w-[135px] xl:w-[200px]">
              <div className="logo-container">
                <Logo/>
              </div>
            </div>
          </a>
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
              <div key={item.label} className="relative">
                <button className="nav-menu-button">
                  {item.label}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {/* Placeholder for dropdown menu content */}
                {/* {item.items && (
                  <div className="dropdown-menu">
                    {item.items.map((subItem) => (
                      <a key={subItem.href} href={subItem.href}>
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                )} */}
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

          {/* Dropdown menu content area (placeholder) */}
          <div className="w-full bg-[var(--pop-yellow-mid)]"></div>
        </div>
      </div>
    </nav>
  );
}
