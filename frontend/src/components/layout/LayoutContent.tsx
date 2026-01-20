"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Cart from "@/components/cart/Cart";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div>
        <div className="h-[130px] md:h-[112px] lg:h-[120px]"></div>
        {children}
      </div>
      <Footer />
      <Cart />
    </>
  );
}
