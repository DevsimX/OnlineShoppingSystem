import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
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
