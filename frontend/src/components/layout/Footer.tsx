"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import FooterLogo from "@/assets/footer-logo.svg";
import Divider from "@/assets/divider.svg";

export default function Footer() {
  return (
    <footer>
      <div className="px-6 py-6 sm:py-10">
        <div className="flex flex-wrap justify-between gap-6 border-b-2 border-dashed pb-12">
          <div className="max-sm:hidden">
            <FooterLogo />
          </div>

          {/* Stay updated section */}
          <div className="max-w-80 space-y-4">
            <p className="text-lg font-stretch-expanded md:text-2xl font-price-check">Stay updated</p>
            <p className="text-lg md:text-xl">Subscribe and receive 10% off your first order over $50!</p>
            <form>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full py-2 bg-white rounded-full border-2 border-[var(--pop-neutral-black)] pr-12 pl-4 shadow-3d focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                  type="submit"
                  className="absolute top-1/2 right-5 -translate-y-1/2 disabled:opacity-50"
                >
                  <Send className="w-6 h-6 p-0.5" />
                  <span className="sr-only">Subscribe</span>
                </button>
              </div>
            </form>
          </div>

          {/* Follow us section */}
          <div>
            <p className="text-lg font-stretch-expanded md:text-2xl font-price-check">Follow us</p>
            <div className="grid grid-cols-3 gap-2 pt-4">
              <a
                href="https://www.instagram.com/popcanberra"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <img
                  src="https://cdn.sanity.io/images/q52u2xck/production/93c8892662fe9b6df1f9e1ae4957e7b465b5a00f-72x72.svg?w=72&h=72&auto=format"
                  alt="Instagram Icon"
                  className="transition-all hover:rotate-12"
                  height="72"
                  width="72"
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <a
                href="https://www.facebook.com/popcanberra"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <img
                  src="https://cdn.sanity.io/images/q52u2xck/production/dd48800e93e2eb1924789833dfeb9952478fa8c1-72x72.svg?w=72&h=72&auto=format"
                  alt="Facebook Icon"
                  className="transition-all hover:rotate-12"
                  height="72"
                  width="72"
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <a
                href="https://www.tiktok.com/@popcanberra"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <img
                  src="https://cdn.sanity.io/images/q52u2xck/production/a84bdadd231673bffdf56938a398a52c5e6d49d3-72x72.svg?w=72&h=72&auto=format"
                  alt="TikTok Icon"
                  className="transition-all hover:rotate-12"
                  height="72"
                  width="72"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Links and copyright */}
        <div className="flex gap-x-6 gap-y-3 pt-12 text-sm font-ultra-bold uppercase max-sm:flex-col sm:flex-wrap sm:items-center md:justify-between md:text-[17px] lg:gap-2">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/refund">Refund Policy</Link>
          <Link href="/social-impact">Social Impact</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/sitemap">Sitemap</Link>
          <Link href="/loyalty">Earn Rewards</Link>
          <span>© Devsim&nbsp;{new Date().getFullYear()}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="relative overflow-hidden border-t-2 border-black">
        <div className="absolute top-0 left-0">
          <Divider />
        </div>
      </div>
    </footer>
  );
}
