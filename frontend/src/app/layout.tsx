import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

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
        <Header />
        <div>
          <div className="h-[130px] md:h-[112px] lg:h-[120px]"></div>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
