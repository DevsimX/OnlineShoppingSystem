"use client";

import Link from "next/link";
import PageHero from "@/components/PageHero";

export default function CheckoutCancelPage() {
  return (
    <main>
      <PageHero firstLine="Checkout" secondLine="Cancelled" />
      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-lg text-stone-700 mb-8">
          Your checkout was cancelled. Your cart items are still saved.
        </p>
        <p className="text-sm text-stone-500 mb-8">
          You can open your cart from the header to complete checkout later.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border-2 border-[var(--pop-red-accent)] px-6 py-3 text-base font-medium text-[var(--pop-red-accent)] hover:bg-[var(--pop-red-accent)] hover:text-white transition-colors"
          >
            Return to shop
          </Link>
          <Link
            href="/account"
            className="inline-flex items-center justify-center rounded-md border-2 border-stone-300 px-6 py-3 text-base font-medium text-stone-700 hover:border-stone-400 transition-colors"
          >
            View account
          </Link>
        </div>
      </section>
    </main>
  );
}
