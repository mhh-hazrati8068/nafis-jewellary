"use client";

import { usePathname } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchModal from "@/components/search/SearchModal";
import OfficialReceiptModal from "@/components/receipt/OfficialReceiptModal";

export default function StoreLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <TopBar />
      <Header />
      <main className="flex-1">{children}</main>
      <CartDrawer />
      <SearchModal />
      <OfficialReceiptModal />
      <Footer />
    </>
  );
}
