"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <main>
      <PageHero firstLine="Thank" secondLine="You!" />
      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-lg text-stone-700 mb-6">
          Your payment was successful. Your order is being processed.
        </p>
        {sessionId && (
          <p className="text-sm text-stone-500 mb-8 font-mono">
            Session: {sessionId.slice(0, 24)}…
          </p>
        )}
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
