"use client";

import MyAccount from "@/assets/account.svg";
import Cart from "@/assets/cart.svg";

type HeaderActionsProps = {
  accountHref: string;
  onAccountClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onOpenCart: () => void;
  cartItemCount: number;
};

export function HeaderActions(props: HeaderActionsProps) {
  const { accountHref, onAccountClick, onOpenCart, cartItemCount } = props;

  return (
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
          href={accountHref}
          onClick={onAccountClick}
          className="IconMenu"
          aria-label="Go to your account"
        >
          <span className="sr-only">Go to your account</span>
          <MyAccount />
        </a>

        {/* Cart Icon */}
        <button
          className="IconMenu relative cursor-pointer"
          aria-label="Open Cart"
          onClick={onOpenCart}
        >
          <span className="sr-only">Open Cart</span>
          <Cart />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-pop-red-accent text-xs font-semibold text-white">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

