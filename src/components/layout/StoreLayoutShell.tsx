"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchModal from "@/components/search/SearchModal";
import OfficialReceiptModal from "@/components/receipt/OfficialReceiptModal";
import AuthModal from "@/components/auth/AuthModal";
import ProfileModal from "@/components/auth/ProfileModal";
import { useAppStore } from "@/store/useAppStore";

export default function StoreLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const { logout, setAuthModalOpen } = useAppStore();

  useEffect(() => {
    if (isAdmin) return;
    const handleUserAuthRequired = () => {
      logout();
      setAuthModalOpen(true);
    };
    window.addEventListener("nafis:user-auth-required", handleUserAuthRequired);
    return () => {
      window.removeEventListener("nafis:user-auth-required", handleUserAuthRequired);
    };
  }, [isAdmin, logout, setAuthModalOpen]);

  if (isAdmin) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <div className="sticky top-0 z-50 w-full">
        {/* Background glass layer on a sibling so backdrop-filter never traps fixed descendants */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 backdrop-blur-2xl bg-white/70 supports-[backdrop-filter]:bg-white/60 border-b border-white/80 shadow-[0_8px_32px_rgba(26,24,22,0.06)] transition-[background-color,box-shadow] duration-300"
        />
        <div className="relative z-10">
          <TopBar />
          <Header />
        </div>
      </div>
      <main className="flex-1">{children}</main>
      <AuthModal />
      <ProfileModal />
      <CartDrawer />
      <SearchModal />
      <OfficialReceiptModal />
      <Footer />
    </>
  );
}
