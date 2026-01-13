import Logo from "@/assets/logo.svg";
export default function Header() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-[var(--background)] max-w-[1533px] left-1/2 -translate-x-1/2">
      {/* Main Navigation */}
      <div className="flex w-full items-center justify-between gap-6 px-3 py-3 max-md:flex-wrap max-md:gap-y-0 max-md:border-b-2 md:px-6 md:py-2 lg:items-start lg:gap-12 lg:pt-3.5 lg:pb-0">
        {/* Mobile Menu Button */}
        <div className="flex flex-1 items-center gap-2 max-md:justify-start md:hidden">
          <button className="inline-flex items-center justify-center" aria-label="Open Menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12h16" />
              <path d="M4 18h16" />
              <path d="M4 6h16" />
            </svg>
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
            className="h-12 w-full items-center rounded-full border-2 border-[var(--pop-neutral-black)] pl-16 shadow-[3px_3px_0_0_#000] focus:ring-0 focus:outline-none sm:text-lg"
            style={{ touchAction: "manipulation" }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute top-1/2 left-6 -translate-y-1/2"
          >
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
        </div>

        {/* Navigation Links & Icons */}
        <div className="flex items-center gap-6 text-lg font-extrabold tracking-wide uppercase max-md:flex-1 max-md:justify-end lg:pt-2">
          {/* Desktop Navigation Links */}
          <a href="/about" className="hover:text-[var(--pop-red-accent)] max-md:hidden">
            About
          </a>
          <a href="/visit" className="hover:text-[var(--pop-red-accent)] max-md:hidden">
            Visit
          </a>

          {/* Icons */}
          <div className="flex gap-2 md:gap-3">
            {/* User Account Icon */}
            <a href="/auth/login" className="inline-flex items-center justify-center" aria-label="Go to your account">
              <span className="sr-only">Go to your account</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M2.5 16.6667C4.44649 14.6021 7.08918 13.3333 10 13.3333C12.9108 13.3333 15.5535 14.6021 17.5 16.6667M13.75 6.25C13.75 8.32107 12.0711 10 10 10C7.92893 10 6.25 8.32107 6.25 6.25C6.25 4.17893 7.92893 2.5 10 2.5C12.0711 2.5 13.75 4.17893 13.75 6.25Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            {/* Cart Icon */}
            <button className="relative inline-flex items-center justify-center cursor-pointer" aria-label="Open Cart">
              <span className="sr-only">Open Cart</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.60995 9.0995C2.55108 8.51082 3.01337 8 3.60499 8H16.395C16.9866 8 17.4489 8.51082 17.39 9.0995L16.6801 16.199C16.5779 17.2214 15.7175 18 14.69 18H5.30997C4.28247 18 3.42214 17.2214 3.3199 16.199L2.60995 9.0995Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M1.5 8L18.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="10" y1="12" x2="10" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="7" y1="12" x2="7" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="13" y1="12" x2="13" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line
                  x1="4.7875"
                  y1="7.39411"
                  x2="8.60184"
                  y2="2.21249"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="1"
                  y1="-1"
                  x2="7.43416"
                  y2="-1"
                  transform="matrix(-0.592827 -0.80533 -0.80533 0.592827 15 8.79227)"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="bg-black xl:-mt-8">
        <div className="relative">
          <div className="flex h-12 items-end justify-center gap-6 max-sm:hidden">
            {/* Shop Menu */}
            <div className="relative">
              <button className="group flex cursor-pointer items-center gap-1 border-b-4 pb-1.5 text-lg font-extrabold tracking-wide uppercase text-white transition-all hover:border-[var(--pop-yellow-mid)] border-transparent">
                Shop
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 transition-transform"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>

            {/* Brands Menu */}
            <div className="relative">
              <button className="group flex cursor-pointer items-center gap-1 border-b-4 pb-1.5 text-lg font-extrabold tracking-wide uppercase text-white transition-all hover:border-[var(--pop-yellow-mid)] border-transparent">
                Brands
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 transition-transform"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>

            {/* Gifts Menu */}
            <div className="relative">
              <button className="group flex cursor-pointer items-center gap-1 border-b-4 pb-1.5 text-lg font-extrabold tracking-wide uppercase text-white transition-all hover:border-[var(--pop-yellow-mid)] border-transparent">
                Gifts
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 transition-transform"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>

            {/* What's Hot */}
            <div className="relative">
              <div className="border-b-4 border-transparent pb-1.5 hover:border-[var(--pop-yellow-mid)]">
                <a href="/collections/whats-hot" className="text-lg font-extrabold tracking-wide uppercase text-white">
                  What's Hot
                </a>
              </div>
            </div>

            {/* New Stuff */}
            <div className="relative">
              <div className="border-b-4 border-transparent pb-1.5 hover:border-[var(--pop-yellow-mid)]">
                <a href="/collections/new-stuff" className="text-lg font-extrabold tracking-wide uppercase text-white">
                  New Stuff
                </a>
              </div>
            </div>

            {/* Gift Cards */}
            <div className="relative">
              <div className="border-b-4 border-transparent pb-1.5 hover:border-[var(--pop-yellow-mid)]">
                <a href="/products/pop-gift-card" className="text-lg font-extrabold tracking-wide uppercase text-white">
                  Gift Cards
                </a>
              </div>
            </div>
          </div>

          {/* Dropdown menu content area (placeholder) */}
          <div className="w-full bg-[var(--pop-yellow-mid)]"></div>
        </div>
      </div>
    </nav>
  );
}
