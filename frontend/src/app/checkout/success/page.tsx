"use client";

import { Suspense } from "react";
import Link from "next/link";
import PageHero from "@/components/PageHero";

function CheckoutSuccessContent() {
  return (
    <main>
      <PageHero firstLine="Thank" secondLine="You!" />
      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-2xl font-price-check mb-8">
          Your payment was successful. Your order is being processed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/account"
            className="inline-flex items-center justify-center rounded-md bg-[var(--pop-red-accent)] px-6 py-3 text-base font-medium text-white hover:opacity-90 transition-opacity"
          >
            View orders
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border-2 border-stone-300 px-6 py-3 text-base font-medium text-stone-700 hover:border-stone-400 transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main>
          <PageHero firstLine="Thank" secondLine="You!" />
          <section className="max-w-2xl mx-auto px-6 py-16 text-center">
            <p className="text-2xl text-stone-700 animate-pulse">Loading…</p>
          </section>
        </main>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
