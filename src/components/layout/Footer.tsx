"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import BrandLogo from "@/components/layout/BrandLogo";
import { 
  InstagramIcon, 
  TelegramIcon, 
  EitaaIcon, 
  BaleIcon, 
  RubikaIcon, 
  SoroushIcon, 
  WhatsAppIcon,
  EnamadBadge 
} from "@/components/layout/SocialAndTrustIcons";

export default function Footer() {
  const { t, language } = useAppStore();

  const socialLinks = [
    { name: "اینستاگرام", nameEn: "Instagram", href: "https://instagram.com", icon: <InstagramIcon className="w-4 h-4" /> },
    { name: "تلگرام", nameEn: "Telegram", href: "https://t.me", icon: <TelegramIcon className="w-4 h-4" /> },
    { name: "ایتا", nameEn: "Eitaa", href: "https://eitaa.com", icon: <EitaaIcon className="w-4 h-4" /> },
    { name: "بله", nameEn: "Bale", href: "https://ble.ir", icon: <BaleIcon className="w-4 h-4" /> },
    { name: "روبیکا", nameEn: "Rubika", href: "https://rubika.ir", icon: <RubikaIcon className="w-4 h-4" /> },
    { name: "سروش", nameEn: "Soroush", href: "https://splus.ir", icon: <SoroushIcon className="w-4 h-4" /> },
    { name: "واتساپ", nameEn: "WhatsApp", href: "https://whatsapp.com", icon: <WhatsAppIcon className="w-4 h-4" /> },
  ];

  return (
    <footer className="bg-[#FAF9F5] text-zinc-800 border-t border-[#C4852B]/30 pt-20 pb-12 transition-colors relative overflow-hidden">
      {/* Subtle brand pattern line at top */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C4852B] to-transparent opacity-60"></div>
      
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-16 relative z-10">
        
        {/* Brand Column (4 of 12 cols) */}
        <div className="md:col-span-4 flex flex-col items-start gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <BrandLogo variant="gold" size="md" showSubline={false} />
            <div className="flex flex-col">
              <span className="text-xl font-brand-en tracking-[0.22em] uppercase font-bold text-zinc-950 group-hover:text-[#C4852B] transition-colors">
                Nafise Ebadi
              </span>
              <span className="text-[10px] uppercase text-[#660000] font-bold ltr:tracking-[0.2em]">
                {language === 'fa' ? 'زیورآلات نفیسه عبادی' : language === 'ar' ? 'مجوهرات نفيسة عبادي' : 'Jewellery Art Direction'}
              </span>
            </div>
          </Link>
          
          <p className="text-xs text-[#626667] leading-relaxed max-w-sm">
            {t.footer.brandDesc}
          </p>
          
          {/* Social Links (Eitaa, Bale, Rubika, Soroush, Instagram, Telegram, WhatsApp) */}
          <div className="mt-2 w-full">
            <span className="text-[10px] uppercase tracking-widest text-[#A06314] font-bold font-mono block mb-2.5">
              {language === 'fa' ? 'پیام‌رسان‌ها و شبکه‌های اجتماعی:' : 'CONNECT WITH ATELIER:'}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {socialLinks.map((s, idx) => (
                <a
                  key={idx}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={language === 'fa' ? s.name : s.nameEn}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#C4852B]/30 hover:border-[#C4852B] text-zinc-700 hover:text-[#660000] hover:scale-105 transition-all shadow-xs text-xs"
                >
                  {s.icon}
                  <span className="text-[11px] font-medium">{language === 'fa' ? s.name : s.nameEn}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Navigation (2 of 12 cols) */}
        <div className="md:col-span-2">
          <h4 className="text-xs uppercase ltr:tracking-[0.2em] text-[#660000] mb-6 font-bold">{t.footer.collectionsTitle}</h4>
          <ul className="flex flex-col gap-3.5 text-xs text-[#626667]">
            <li><Link href="/rings" className="hover:text-[#C4852B] transition-colors">{t.footer.rings}</Link></li>
            <li><Link href="/necklaces" className="hover:text-[#C4852B] transition-colors">{t.footer.necklaces}</Link></li>
            <li><Link href="/bracelets" className="hover:text-[#C4852B] transition-colors">{t.footer.bracelets}</Link></li>
            <li><Link href="/earrings" className="hover:text-[#C4852B] transition-colors">{t.footer.earrings}</Link></li>
            <li><Link href="/collections" className="hover:text-[#C4852B] transition-colors">{t.footer.sets}</Link></li>
          </ul>
        </div>

        {/* Support (2 of 12 cols) */}
        <div className="md:col-span-2">
          <h4 className="text-xs uppercase ltr:tracking-[0.2em] text-[#660000] mb-6 font-bold">{t.footer.serviceTitle}</h4>
          <ul className="flex flex-col gap-3.5 text-xs text-[#626667]">
            <li><Link href="/stores" className="hover:text-[#C4852B] transition-colors">{t.footer.findBranch}</Link></li>
            <li><Link href="/contact" className="hover:text-[#C4852B] transition-colors">{t.footer.bookAppt}</Link></li>
            <li><Link href="/shipping" className="hover:text-[#C4852B] transition-colors">{t.footer.shippingPolicy}</Link></li>
            <li><Link href="/care" className="hover:text-[#C4852B] transition-colors">{t.footer.careGuide}</Link></li>
            <li><Link href="/articles" className="hover:text-[#C4852B] transition-colors">{t.footer.journal}</Link></li>
          </ul>
        </div>

        {/* Newsletter & eNamad Trust Seal (4 of 12 cols) */}
        <div className="md:col-span-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs uppercase ltr:tracking-[0.2em] text-[#660000] mb-3 font-bold">{t.footer.circleTitle}</h4>
            <p className="text-xs text-[#626667] mb-4 leading-relaxed">
              {t.footer.circleDesc}
            </p>
            <form className="flex flex-col sm:flex-row gap-2 mb-6" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder={t.footer.emailPlaceholder} 
                className="w-full border border-zinc-300 bg-white px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#C4852B] rounded-xl transition-colors shadow-sm"
              />
              <button 
                type="submit" 
                className="sm:w-auto px-5 py-2.5 bg-[#660000] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#7D0000] transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                {t.footer.subscribe}
              </button>
            </form>
          </div>

          {/* eNamad Trust Emblem & Guarantee */}
          <div className="pt-4 border-t border-zinc-200/80 flex items-center gap-4">
            <EnamadBadge className="w-24 h-24 shrink-0" />
            <div className="text-[11px] text-zinc-600 leading-snug">
              <span className="font-bold text-[#003B73] block mb-1">
                نماد اعتماد الکترونیکی (اینماد)
              </span>
              <span>دارای مجوز رسمی کسب‌وکار اینترنتی، درگاه پرداخت امن شاپرک و تضمین کامل حقوق خریداران.</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="container mx-auto px-6 md:px-12 border-t border-[#C4852B]/20 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#626667]">
        <p>&copy; {new Date().getFullYear()} {t.footer.rights}</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-[#C4852B] transition-colors">{t.footer.privacy}</Link>
          <Link href="/terms" className="hover:text-[#C4852B] transition-colors">{t.footer.terms}</Link>
        </div>
      </div>
    </footer>
  );
}
