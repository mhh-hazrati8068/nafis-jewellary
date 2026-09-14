import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopBar from "@/components/layout/TopBar";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchModal from "@/components/search/SearchModal";
import LanguageWrapper from "@/components/layout/LanguageWrapper";
import OfficialReceiptModal from "@/components/receipt/OfficialReceiptModal";

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

export const viewport: Viewport = {
  themeColor: "#C4852B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nafiseebadijewellery.com"),
  title: {
    default: "زیورآلات نفیسه عبادی | Nafise Ebadi Jewellery | مجوهرات نفيسة عبادي",
    template: "%s | زیورآلات نفیسه عبادی",
  },
  description: "Official 2026 Brand Identity Showcase & Luxury Silver Jewellery E-Commerce — Handcrafted 925 Sterling Silver, Natural Agate, Neyshabur Turquoise & Certified Gemstones.",
  keywords: [
    "زیورآلات نفیسه عبادی",
    "نقره ۹۲۵ دست‌ساز",
    "نقره دست ساز",
    "انگشتر فیروزه نیشابور",
    "عقیق یمنی",
    "نقره استرلینگ",
    "Nafise Ebadi Jewellery",
    "Handcrafted 925 Silver",
    "Fine Sterling Silver",
    "Luxury Iranian Jewelry",
    "مجوهرات نفيسة عبادي",
    "فضة استرليني 925"
  ],
  authors: [{ name: "Nafise Ebadi Master Atelier" }],
  creator: "Nafise Ebadi Jewellery",
  publisher: "Nafise Ebadi Jewellery",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Nafise Ebadi Jewellery | زیورآلات نفیسه عبادی",
    description: "Handcrafted Luxury In Every Detail — Handcrafted 925 Sterling Silver & Certified Natural Gemstone Creations.",
    url: "https://nafiseebadijewellery.com",
    siteName: "Nafise Ebadi Jewellery",
    locale: "fa_IR",
    alternateLocale: ["en_US", "ar_SA"],
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Nafise Ebadi Luxury Jewellery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nafise Ebadi Jewellery | زیورآلات نفیسه عبادی",
    description: "Handcrafted 925 Sterling Silver & Certified Natural Gemstones.",
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop"],
  },
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "JewelryStore",
      "@id": "https://nafiseebadijewellery.com/#store",
      "name": "زیورآلات نفیسه عبادی | Nafise Ebadi Jewellery",
      "alternateName": "Nafise Ebadi Fine Silver Jewellery",
      "url": "https://nafiseebadijewellery.com",
      "logo": "https://nafiseebadijewellery.com/logo.jpg",
      "image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop",
      "description": "فروشگاه تخصصی زیورآلات دست‌ساز نقره استرلینگ ۹۲۵ و سنگ‌های طبیعی اصیل فیروزه نیشابور و عقیق طبیعی همراه با شناسنامه معتبر.",
      "priceRange": "$$",
      "currenciesAccepted": "IRT, IRR",
      "paymentAccepted": "Online Payment, Debit Card",
      "telephone": "+98-21-22008800",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "خیابان فرشته، برج رز، طبقه همکف",
        "addressLocality": "تهران",
        "addressRegion": "تهران",
        "addressCountry": "IR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "35.7905",
        "longitude": "51.4255"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
          "opens": "09:30",
          "closes": "21:30"
        }
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://nafiseebadijewellery.com/#website",
      "url": "https://nafiseebadijewellery.com",
      "name": "زیورآلات نفیسه عبادی",
      "publisher": {
        "@id": "https://nafiseebadijewellery.com/#store"
      },
      "inLanguage": ["fa-IR", "en-US", "ar-SA"],
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://nafiseebadijewellery.com/shop?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${kalameh.variable} ${clashDisplay.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased text-[#1A1816] bg-[#FFFFFF] dark:bg-[#FAF9F5] selection:bg-[#660000] selection:text-white transition-colors duration-300">
        <LanguageWrapper>
          <TopBar />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <CartDrawer />
          <SearchModal />
          <OfficialReceiptModal />
          <Footer />
        </LanguageWrapper>
      </body>
    </html>
  );
}
