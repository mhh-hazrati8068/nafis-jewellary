import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopBar from "@/components/layout/TopBar";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchModal from "@/components/search/SearchModal";
import LanguageWrapper from "@/components/layout/LanguageWrapper";

const kalameh = localFont({
  src: [
    {
      path: "../../public/fonts/Kalameh-Thin.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/Kalameh-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Kalameh-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Kalameh-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-kalameh",
  display: "swap",
});

const clashDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/ClashDisplay-Extralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clash",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nafise Ebadi Jewellery | زیورآلات نفیسه عبادی",
  description: "Official 2026 Brand Identity Showcase & Luxury High-Jewellery E-Commerce — Handcrafted 18K Solid Gold & Certified Natural Gemstones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${kalameh.variable} ${clashDisplay.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased text-[#1A1816] bg-[#FFFFFF] dark:bg-[#FAF9F5] selection:bg-[#660000] selection:text-white transition-colors duration-300">
        <LanguageWrapper>
          <TopBar />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <CartDrawer />
          <SearchModal />
          <Footer />
        </LanguageWrapper>
      </body>
    </html>
  );
}

