"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { useEffect, useState } from "react";
import BrandLogo from "@/components/layout/BrandLogo";
import AuthModal from "@/components/auth/AuthModal";
import ProfileModal from "@/components/auth/ProfileModal";

export default function Header() {
  const { 
    cart, 
    toggleCart, 
    wishlist, 
    language, 
    toggleLanguage, 
    theme, 
    toggleTheme, 
    toggleSearch, 
    t,
    user,
    token,
    isAdmin,
    setAuthModalOpen,
    setProfileModalOpen,
    loadUserFromStorage,
    fetchProducts,
    fetchSilverPrice
  } = useAppStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadUserFromStorage();
    fetchProducts();
    fetchSilverPrice();
  }, [loadUserFromStorage, fetchProducts, fetchSilverPrice]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#C4852B]/20 bg-[#FFFFFF]/95 dark:bg-[#FAF9F5]/95 backdrop-blur-sm transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-2 overflow-hidden">
          
          {/* Mobile Navigation Toggle Only */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-zinc-900 hover:text-[#C4852B] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 18 18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
              </svg>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex flex-1 items-center gap-7 text-[11px] uppercase tracking-[0.15em] font-medium text-zinc-800">
            <Link href="/shop" className="hover:text-[#C4852B] transition-colors relative py-1 group">
              <span className="font-bold text-[#C4852B]">{language === 'fa' ? 'فروشگاه آنلاین' : 'Shop'}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C4852B] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/rings" className="hover:text-[#C4852B] transition-colors relative py-1 group">
              <span>{t.header.rings}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C4852B] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/necklaces" className="hover:text-[#C4852B] transition-colors relative py-1 group">
              <span>{t.header.necklaces}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C4852B] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/bracelets" className="hover:text-[#C4852B] transition-colors relative py-1 group">
              <span>{t.header.bracelets}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C4852B] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/collections" className="hover:text-[#C4852B] transition-colors relative py-1 group">
              <span>{t.header.collections}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C4852B] group-hover:w-full transition-all duration-300"></span>
            </Link>
            {isAdmin && (
              <Link href="/admin" className="px-2 py-0.5 rounded bg-[#660000] text-white text-[10px] font-bold tracking-wider hover:bg-[#800000] transition-colors shadow-sm">
                ⚙️ {language === 'fa' ? 'پنل مدیریت' : 'Admin Panel'}
              </Link>
            )}
          </nav>

          {/* Brand Logo */}
          <div className="flex-1 flex justify-center text-center">
            <Link href="/" className="flex items-center gap-2.5 group py-1">
              <BrandLogo size="sm" showSubline={false} />
              <div className="flex flex-col items-start text-left rtl:text-right rtl:items-end">
                <span className="text-base sm:text-lg md:text-xl tracking-[0.2em] font-brand-en uppercase font-bold text-zinc-950 group-hover:text-[#C4852B] transition-colors whitespace-nowrap">
                  Nafise Ebadi
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-[#660000] font-mono whitespace-nowrap font-bold">
                  {language === 'fa' ? 'زیورآلات نفیسه عبادی' : 'Fine Jewellery'}
                </span>
              </div>
            </Link>
          </div>

          {/* Header Actions */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-3">
            
            {/* Search Trigger */}
            <button 
              onClick={() => toggleSearch(true)}
              aria-label="Search" 
              className="p-1.5 text-zinc-800 hover:text-[#C4852B] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>

            {/* User Account / Login Button */}
            {token ? (
              <button
                onClick={() => setProfileModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#C4852B]/40 bg-[#C4852B]/10 hover:bg-[#C4852B]/20 text-zinc-900 text-xs font-medium transition-all"
                title={language === 'fa' ? 'پروفایل و سفارش‌ها' : 'Profile & Orders'}
              >
                <span className="w-5 h-5 rounded-full bg-[#C4852B] text-white flex items-center justify-center text-[10px] font-bold">
                  {user?.firstName ? user.firstName[0] : (isAdmin ? '👑' : '👤')}
                </span>
                <span className="hidden lg:inline text-[11px] font-mono font-semibold">
                  {user?.firstName || user?.phoneNumber || (isAdmin ? 'Admin' : 'User')}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="p-1.5 text-zinc-800 hover:text-[#C4852B] transition-colors flex items-center gap-1"
                aria-label="Login"
                title={language === 'fa' ? 'ورود به حساب کاربری' : 'Sign In'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <span className="hidden xl:inline text-[11px] font-medium tracking-wider uppercase">
                  {language === 'fa' ? 'ورود' : 'Login'}
                </span>
              </button>
            )}

            {/* Desktop Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="hidden md:flex p-2 rounded-full text-zinc-800 hover:text-[#C4852B] transition-colors border border-zinc-200 bg-white/90 dark:bg-[#F4F1EA] shadow-sm cursor-pointer"
              aria-label="Toggle Theme"
              title={theme === 'dark' ? 'حالت روشن عاجی / Ivory Light' : 'حالت کتان گرم / Warm Linen'}
            >
              {theme === 'dark' ? (
                <span className="text-xs" title="Warm Linen Mode">🏛️</span>
              ) : (
                <span className="text-xs" title="Pure Ivory Mode">✨</span>
              )}
            </button>

            {/* Desktop Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#C4852B]/40 bg-[#C4852B]/10 text-[#C4852B] hover:bg-[#C4852B] hover:text-white text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm"
            >
              <span>🌐</span>
              <span>{language === 'fa' ? 'English' : 'فارسی'}</span>
            </button>

            {/* Wishlist */}
            <button 
              aria-label="Wishlist" 
              className="hidden sm:block p-1.5 text-zinc-800 hover:text-[#660000] transition-colors relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill={wishlist.length > 0 ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className={`w-5 h-5 ${wishlist.length > 0 ? "text-[#660000]" : ""}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-[#660000]"></span>
              )}
            </button>

            {/* Cart Trigger */}
            <button 
              onClick={() => toggleCart(true)}
              aria-label="Shopping Cart" 
              className="p-1.5 text-zinc-800 hover:text-[#C4852B] transition-colors relative flex items-center cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-[#C4852B] text-[10px] font-bold text-white font-mono shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Auth Modal & Profile Modal */}
      <AuthModal />
      <ProfileModal />

      {/* Mobile Menu with Smooth Slide In & Out Animations */}
      <div 
        className={`fixed inset-0 z-40 md:hidden flex flex-col bg-[#FFFFFF]/98 dark:bg-[#FAF9F5]/98 text-zinc-900 pt-20 px-6 gap-6 backdrop-blur-md transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileMenuOpen 
            ? "translate-y-0 opacity-100 pointer-events-auto" 
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col gap-5 text-sm uppercase tracking-[0.2em] font-medium border-b border-zinc-200 pb-6">
          <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C4852B] font-bold text-[#C4852B]">{language === 'fa' ? 'فروشگاه آنلاین' : 'Shop'}</Link>
          <Link href="/rings" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C4852B]">{t.header.rings}</Link>
          <Link href="/necklaces" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C4852B]">{t.header.necklaces}</Link>
          <Link href="/bracelets" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C4852B]">{t.header.bracelets}</Link>
          <Link href="/collections" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C4852B]">{t.header.collections}</Link>
          {isAdmin && (
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-[#660000] font-bold">⚙️ {language === 'fa' ? 'پنل مدیریت ادمین' : 'Admin Panel'}</Link>
          )}
        </nav>
        <div className="flex flex-col gap-3 text-xs">
          {token ? (
            <button
              onClick={() => { setProfileModalOpen(true); setMobileMenuOpen(false); }}
              className="flex items-center justify-between p-3.5 rounded-lg border border-[#C4852B] bg-[#C4852B]/10 font-bold text-[#C4852B]"
            >
              <span>{language === 'fa' ? 'حساب کاربری و سفارش‌ها' : 'Profile & Orders'}</span>
              <span>👤</span>
            </button>
          ) : (
            <button
              onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }}
              className="flex items-center justify-between p-3.5 rounded-lg border border-[#C4852B] bg-[#C4852B]/10 font-bold text-[#C4852B]"
            >
              <span>{language === 'fa' ? 'ورود / عضویت با شماره موبایل' : 'Sign In / Register'}</span>
              <span>🔑</span>
            </button>
          )}
          <button
            onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
            className="flex items-center justify-between p-3.5 rounded-lg border border-zinc-300 bg-white font-semibold"
          >
            <span>تم رنگی پوسته / Theme</span>
            <span>{theme === 'dark' ? '🏛️ کتان گرم (Warm Linen)' : '✨ عاجی سفید (Pure Ivory)'}</span>
          </button>
          <button
            onClick={() => { toggleLanguage(); setMobileMenuOpen(false); }}
            className="flex items-center justify-between p-3.5 rounded-lg border border-[#C4852B]/40 bg-[#C4852B]/10 text-[#C4852B] font-bold"
          >
            <span>زبان / Language</span>
            <span>{language === 'fa' ? 'تغییر به English' : 'Switch to فارسی'}</span>
          </button>
        </div>
      </div>
    </>
  );
}
