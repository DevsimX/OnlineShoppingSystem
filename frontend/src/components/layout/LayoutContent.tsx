"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { useCart } from "@/contexts/CartContext";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isCartOpen, closeCart } = useCart();

  return (
    <>
      <Header />
      <div>
        <div className="h-[130px] md:h-[112px] lg:h-[120px]"></div>
        {children}
      </div>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}
