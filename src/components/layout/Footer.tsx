"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import BrandLogo from "@/components/layout/BrandLogo";
import { CONTACT_CONFIG, ENAMAD_CONFIG } from "@/lib/contactConfig";
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
    { name: "اینستاگرام", nameEn: "Instagram", href: CONTACT_CONFIG.instagramHref, icon: <InstagramIcon className="w-4 h-4" /> },
    { name: "تلگرام", nameEn: "Telegram", href: CONTACT_CONFIG.telegramHref, icon: <TelegramIcon className="w-4 h-4" /> },
    { name: "ایتا", nameEn: "Eitaa", href: CONTACT_CONFIG.eitaaHref, icon: <EitaaIcon className="w-4 h-4" /> },
    { name: "بله", nameEn: "Bale", href: CONTACT_CONFIG.baleHref, icon: <BaleIcon className="w-4 h-4" /> },
    { name: "روبیکا", nameEn: "Rubika", href: CONTACT_CONFIG.rubikaHref, icon: <RubikaIcon className="w-4 h-4" /> },
    { name: "سروش", nameEn: "Soroush", href: CONTACT_CONFIG.soroushHref, icon: <SoroushIcon className="w-4 h-4" /> },
    { name: "واتساپ", nameEn: "WhatsApp", href: CONTACT_CONFIG.whatsappHref, icon: <WhatsAppIcon className="w-4 h-4" /> },
  ];
  const activeSocialLinks = socialLinks.filter((s) => Boolean(s.href));

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
          
          {/* Social Links (rendered only when official links are configured) */}
          <div className="mt-2 w-full">
            <span className="text-[10px] uppercase tracking-widest text-[#A06314] font-bold font-mono block mb-2.5">
              {language === 'fa' ? 'راه‌های ارتباطی رسمی:' : 'CONNECT WITH ATELIER:'}
            </span>
            {activeSocialLinks.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                {activeSocialLinks.map((s, idx) => (
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
            ) : (
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#C4852B]/30 hover:border-[#C4852B] text-zinc-700 hover:text-[#660000] transition-all shadow-xs text-xs font-medium"
              >
                {language === 'fa' ? 'اطلاعات تماس رسمی به‌زودی در صفحه تماس درج می‌شود' : 'Official channels updating — Contact Page'}
              </Link>
            )}
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
            <li><Link href="/shop?filter=sets" className="hover:text-[#C4852B] transition-colors">{t.footer.sets}</Link></li>
          </ul>
        </div>

        {/* Support (2 of 12 cols) */}
        <div className="md:col-span-2">
          <h4 className="text-xs uppercase ltr:tracking-[0.2em] text-[#660000] mb-6 font-bold">{t.footer.serviceTitle}</h4>
          <ul className="flex flex-col gap-3.5 text-xs text-[#626667]">
            <li><Link href="/stores" className="hover:text-[#C4852B] transition-colors">{t.footer.findBranch}</Link></li>
            <li><Link href="/contact" className="hover:text-[#C4852B] transition-colors">{t.footer.bookAppt}</Link></li>
            <li><Link href="/about" className="hover:text-[#C4852B] transition-colors">{t.header.aboutUs}</Link></li>
            <li><Link href="/articles/silver-and-gemstone-care-guide" className="hover:text-[#C4852B] transition-colors">{t.footer.careGuide}</Link></li>
            <li><Link href="/articles" className="hover:text-[#C4852B] transition-colors">{t.footer.journal}</Link></li>
            <li>
              <a
                href={CONTACT_CONFIG.emadWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C4852B] transition-colors"
              >
                {language === 'fa' ? 'وب‌سایت شرکت عماد آسمان' : language === 'ar' ? 'موقع شركة عماد آسمان' : 'Emad Aseman Website'}
              </a>
            </li>
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

          {/* eNamad Trust Emblem (only rendered when officially verified) */}
          <div className="pt-4 border-t border-zinc-200/80 flex items-center gap-4">
            {ENAMAD_CONFIG.isVerified && ENAMAD_CONFIG.id && ENAMAD_CONFIG.code ? (
              <>
                <EnamadBadge className="w-24 h-24 shrink-0" />
                <div className="text-[11px] text-zinc-600 leading-snug">
                  <span className="font-bold text-[#003B73] block mb-1">
                    نماد اعتماد الکترونیکی (اینماد)
                  </span>
                  <span>دارای نماد اعتماد الکترونیکی معتبر و تضمین حقوق خریداران.</span>
                </div>
              </>
            ) : (
              <div className="text-[11px] text-zinc-600 leading-relaxed">
                <span className="font-bold text-[#660000] block mb-1">
                  ضمانت اصالت نقره ۹۲۵ و فاکتور رسمی
                </span>
                <span>تمامی سفارش‌ها همراه با فاکتور رسمی و شناسنامه اصالت نقره مجموعه نفیسه عبادی ارائه می‌شوند.</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="container mx-auto px-6 md:px-12 border-t border-[#C4852B]/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#626667]">
        <p>&copy; {new Date().getFullYear()} {t.footer.rights}</p>
        <Link href="/contact" className="hover:text-[#C4852B] transition-colors">
          {language === 'fa' ? 'ارتباط با پشتیبانی و امور مشتریان' : language === 'ar' ? 'تواصل مع خدمة العملاء' : 'Client Concierge & Contact'}
        </Link>
      </div>
    </footer>
  );
}
