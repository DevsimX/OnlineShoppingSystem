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
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 3000,
          }}
        />
        <CartProvider>
          <LayoutContent>{children}</LayoutContent>
        </CartProvider>
      </body>
    </html>
  );
}
