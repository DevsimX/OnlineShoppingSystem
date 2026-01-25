import "./globals.css";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/contexts/CartContext";
import LayoutContent from "@/components/layout/LayoutContent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="relative mx-auto max-w-[96rem] overflow-hidden border-black 2xl:border-r-2 2xl:border-l-2">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
            }}
          />
          <CartProvider>
            <LayoutContent>{children}</LayoutContent>
          </CartProvider>
        </div>
      </body>
    </html>
  );
}
