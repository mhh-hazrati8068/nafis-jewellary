"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { useEffect, useState, useSyncExternalStore } from "react";
import BrandLogo from "@/components/layout/BrandLogo";
import LanguageDropdown from "@/components/layout/LanguageDropdown";
import CollectionsMegaMenu from "@/components/layout/CollectionsMegaMenu";
import AuthModal from "@/components/auth/AuthModal";
import ProfileModal from "@/components/auth/ProfileModal";

const emptySubscribe = () => () => {};

export default function Header() {
  const { 
    cart, 
    toggleCart, 
    wishlist, 
    language, 
    setLanguage, 
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
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    loadUserFromStorage();
    fetchProducts();
    fetchSilverPrice();
  }, [loadUserFromStorage, fetchProducts, fetchSilverPrice]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#C4852B]/20 bg-[#FFFFFF]/95 dark:bg-[#FAF9F5]/95 backdrop-blur-md shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Mobile Navigation Toggle */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-900 hover:text-[#C4852B] transition-colors rounded-lg hover:bg-zinc-100 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 18 18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
              </svg>
            </button>
          </div>

          {/* Desktop Navigation Links: Online Shop | Collections (Mega Menu) | Journal | About Us */}
          <nav className="hidden md:flex flex-1 items-center gap-6 lg:gap-8 text-[13px] font-semibold text-zinc-800 font-sans">
            {/* 1. Online Shop */}
            <Link href="/shop" className="hover:text-[#C4852B] transition-colors relative py-1 group">
              <span className="font-bold text-[#C4852B]">{t.header.shop}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C4852B] group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* 2. Collections (Mega Menu opens on hover with interactive sample preview) */}
            <CollectionsMegaMenu />

            {/* 3. Journal */}
            <Link href="/articles" className="hover:text-[#C4852B] transition-colors relative py-1 group">
              <span>{t.header.journal}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C4852B] group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* 4. About Us */}
            <Link href="/about" className="hover:text-[#C4852B] transition-colors relative py-1 group">
              <span>{t.header.aboutUs}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C4852B] group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Admin Badge if authorized */}
            {mounted && isAdmin && (
              <Link href="/admin" className="px-2.5 py-1 rounded-full bg-[#660000] text-white text-[10px] font-bold tracking-wider hover:bg-[#800000] transition-colors shadow-xs">
                ⚙️ {t.header.admin}
              </Link>
            )}
          </nav>

          {/* Brand Logo & Brand Name (English on Top, Persian/Native on Bottom) */}
          <div className="flex-1 flex justify-center text-center">
            <Link href="/" className="flex items-center gap-3 group py-1">
              <BrandLogo size="md" showSubline={false} />
              <div className="flex flex-col items-start text-left rtl:text-right rtl:items-end justify-center">
                {/* English Brand Name on TOP */}
                <span className="font-brand-en font-black uppercase text-base sm:text-lg md:text-xl text-zinc-950 group-hover:text-[#C4852B] transition-colors whitespace-nowrap leading-tight tracking-[0.14em]">
                  NAFISE EBADI
                </span>

                {/* Persian/Subtitle on BOTTOM */}
                <span className="font-kalameh font-bold text-xs sm:text-sm text-[#660000] whitespace-nowrap leading-tight pt-0.5">
                  {language === 'ar' 
                    ? 'مجوهرات نفيسة عبادي للفضة' 
                    : language === 'en' 
                    ? 'HANDCRAFTED 925 SILVER' 
                    : 'زیورآلات نقره نفیسه عبادی'}
                </span>
              </div>
            </Link>
          </div>

          {/* Header Actions */}
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            
            {/* Search Trigger */}
            <button 
              onClick={() => toggleSearch(true)}
              aria-label="Search" 
              className="p-2 text-zinc-800 hover:text-[#C4852B] hover:bg-zinc-100 dark:hover:bg-[#F4F1EA] rounded-full transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>

            {/* User Account / Login Button */}
            {mounted && token ? (
              <button
                onClick={() => setProfileModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C4852B]/40 bg-[#C4852B]/10 hover:bg-[#C4852B]/20 text-zinc-900 text-xs font-semibold transition-all cursor-pointer shadow-2xs font-sans"
                title={t.header.profile}
              >
                <span className="w-5 h-5 rounded-full bg-[#C4852B] text-white flex items-center justify-center text-[10px] font-bold">
                  {user?.firstName ? user.firstName[0] : (isAdmin ? '👑' : '👤')}
                </span>
                <span className="hidden lg:inline text-[11px] font-mono font-bold">
                  {user?.firstName || user?.phoneNumber || (isAdmin ? 'Admin' : 'User')}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="p-2 text-zinc-800 hover:text-[#C4852B] hover:bg-zinc-100 dark:hover:bg-[#F4F1EA] rounded-full transition-colors flex items-center gap-1 cursor-pointer font-sans"
                aria-label="Login"
                title={t.header.login}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <span className="hidden xl:inline text-xs font-bold">
                  {t.header.login}
                </span>
              </button>
            )}

            {/* Desktop Shopify-Style Language Dropdown */}
            <div className="hidden md:block">
              <LanguageDropdown />
            </div>

            {/* Wishlist */}
            <button 
              aria-label="Wishlist" 
              className="hidden sm:block p-2 text-zinc-800 hover:text-[#660000] hover:bg-zinc-100 dark:hover:bg-[#F4F1EA] rounded-full transition-colors relative cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill={wishlist.length > 0 ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${wishlist.length > 0 ? "text-[#660000]" : ""}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-[#660000]"></span>
              )}
            </button>

            {/* Cart Trigger Button */}
            <button 
              onClick={() => toggleCart(true)}
              aria-label="Shopping Cart" 
              className="p-2 text-zinc-800 hover:text-[#C4852B] hover:bg-zinc-100 dark:hover:bg-[#F4F1EA] rounded-full transition-colors relative flex items-center cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-[#660000] text-[10px] font-bold text-white font-mono shadow-sm">
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
        className={`fixed inset-0 z-40 md:hidden flex flex-col bg-[#FFFFFF]/98 text-zinc-900 pt-20 px-6 gap-6 backdrop-blur-md transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileMenuOpen 
            ? "translate-y-0 opacity-100 pointer-events-auto" 
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col gap-3 text-sm font-semibold text-zinc-900 border-b border-zinc-200 pb-6 font-sans">
          <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C4852B] font-bold text-[#C4852B] py-1.5 flex items-center justify-between">
            <span>{t.header.shop}</span>
            <span>🛍️</span>
          </Link>

          {/* Collections Accordion / Sublinks for Mobile */}
          <div className="flex flex-col gap-1 py-1">
            <Link href="/collections" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C4852B] font-bold text-zinc-900 py-1.5 flex items-center justify-between">
              <span>{t.header.collections}</span>
              <span>✨</span>
            </Link>
            <div className="ps-4 flex flex-col gap-1.5 text-xs text-zinc-600 border-s-2 border-[#C4852B]/30 ms-2">
              <Link href="/rings" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C4852B] py-1">💍 {t.header.rings}</Link>
              <Link href="/necklaces" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C4852B] py-1">📿 {t.header.necklaces}</Link>
              <Link href="/bracelets" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C4852B] py-1">✨ {t.header.bracelets}</Link>
              <Link href="/earrings" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C4852B] py-1">💎 {t.header.earrings}</Link>
            </div>
          </div>

          <Link href="/articles" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C4852B] py-1.5 flex items-center justify-between">
            <span>{t.header.journal}</span>
            <span>📖</span>
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#C4852B] py-1.5 flex items-center justify-between">
            <span>{t.header.aboutUs}</span>
            <span>🏛️</span>
          </Link>
          {isAdmin && (
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-[#660000] font-bold py-1.5 flex items-center justify-between">
              <span>⚙️ {t.header.admin}</span>
              <span>👑</span>
            </Link>
          )}
        </nav>
        <div className="flex flex-col gap-3 text-xs font-sans">
          {token ? (
            <button
              onClick={() => { setProfileModalOpen(true); setMobileMenuOpen(false); }}
              className="flex items-center justify-between p-3.5 rounded-xl border border-[#C4852B] bg-[#C4852B]/10 font-bold text-[#C4852B] cursor-pointer"
            >
              <span>{t.header.profile}</span>
              <span>👤</span>
            </button>
          ) : (
            <button
              onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }}
              className="flex items-center justify-between p-3.5 rounded-xl border border-[#C4852B] bg-[#C4852B]/10 font-bold text-[#C4852B] cursor-pointer"
            >
              <span>{language === 'fa' ? 'ورود / عضویت با شماره موبایل' : language === 'ar' ? 'تسجيل الدخول / إنشاء حساب' : 'Sign In / Register'}</span>
              <span>🔑</span>
            </button>
          )}

          {/* Mobile Language Selector */}
          <div className="flex flex-col gap-2 p-3 rounded-xl border border-[#C4852B]/30 bg-[#C4852B]/5">
            <span className="text-[11px] font-semibold text-zinc-600">انتخاب زبان / Language / اللغة:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { setLanguage('fa'); setMobileMenuOpen(false); }}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  language === 'fa' ? 'bg-[#C4852B] text-white shadow-xs' : 'bg-white text-zinc-800 border border-zinc-200'
                }`}
              >
                <span>🇮🇷</span>
                <span>فارسی</span>
              </button>
              <button
                onClick={() => { setLanguage('en'); setMobileMenuOpen(false); }}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  language === 'en' ? 'bg-[#C4852B] text-white shadow-xs' : 'bg-white text-zinc-800 border border-zinc-200'
                }`}
              >
                <span>🇬🇧</span>
                <span>English</span>
              </button>
              <button
                onClick={() => { setLanguage('ar'); setMobileMenuOpen(false); }}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  language === 'ar' ? 'bg-[#C4852B] text-white shadow-xs' : 'bg-white text-zinc-800 border border-zinc-200'
                }`}
              >
                <span>🇸🇦</span>
                <span>العربية</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
