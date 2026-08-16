"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import BrandLogo from "@/components/layout/BrandLogo";

export default function Footer() {
  const { t, language } = useAppStore();

  return (
    <footer className="bg-[#FAF9F5] text-zinc-800 border-t border-[#C4852B]/30 pt-20 pb-12 transition-colors relative overflow-hidden">
      {/* Subtle brand pattern line at top */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C4852B] to-transparent opacity-60"></div>
      
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 relative z-10">
        
        {/* Brand Column */}
        <div className="flex flex-col items-start gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <BrandLogo variant="gold" size="md" showSubline={false} />
            <div className="flex flex-col">
              <span className="text-xl font-brand-en tracking-[0.22em] uppercase font-bold text-zinc-950 group-hover:text-[#C4852B] transition-colors">
                Nafise Ebadi
              </span>
              <span className="text-[9px] tracking-[0.28em] uppercase text-[#660000] font-mono font-bold">
                {language === 'fa' ? 'زیورآلات نفیسه عبادی' : 'Jewellery Art Direction'}
              </span>
            </div>
          </Link>
          
          <p className="text-xs text-[#626667] leading-relaxed max-w-sm">
            {t.footer.brandDesc}
          </p>
          
          <div className="flex items-center gap-4 text-[#626667] text-xs">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C4852B] transition-colors tracking-wider uppercase font-semibold">Instagram</a>
            <span className="text-[#660000]">•</span>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C4852B] transition-colors tracking-wider uppercase font-semibold">Pinterest</a>
            <span className="text-[#660000]">•</span>
            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C4852B] transition-colors tracking-wider uppercase font-semibold">WhatsApp</a>
          </div>
        </div>
        
        {/* Navigation */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-[#660000] mb-6 font-bold font-mono">{t.footer.collectionsTitle}</h4>
          <ul className="flex flex-col gap-3.5 text-xs text-[#626667]">
            <li><Link href="/rings" className="hover:text-[#C4852B] transition-colors">{t.footer.rings}</Link></li>
            <li><Link href="/necklaces" className="hover:text-[#C4852B] transition-colors">{t.footer.necklaces}</Link></li>
            <li><Link href="/bracelets" className="hover:text-[#C4852B] transition-colors">{t.footer.bracelets}</Link></li>
            <li><Link href="/earrings" className="hover:text-[#C4852B] transition-colors">{t.footer.earrings}</Link></li>
            <li><Link href="/collections" className="hover:text-[#C4852B] transition-colors">{t.footer.sets}</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-[#660000] mb-6 font-bold font-mono">{t.footer.serviceTitle}</h4>
          <ul className="flex flex-col gap-3.5 text-xs text-[#626667]">
            <li><Link href="/stores" className="hover:text-[#C4852B] transition-colors">{t.footer.findBranch}</Link></li>
            <li><Link href="/contact" className="hover:text-[#C4852B] transition-colors">{t.footer.bookAppt}</Link></li>
            <li><Link href="/shipping" className="hover:text-[#C4852B] transition-colors">{t.footer.shippingPolicy}</Link></li>
            <li><Link href="/care" className="hover:text-[#C4852B] transition-colors">{t.footer.careGuide}</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-[#660000] mb-6 font-bold font-mono">{t.footer.circleTitle}</h4>
          <p className="text-xs text-[#626667] mb-4 leading-relaxed">
            {t.footer.circleDesc}
          </p>
          <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder={t.footer.emailPlaceholder} 
              className="w-full border border-zinc-300 bg-white px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#C4852B] rounded-xl transition-colors shadow-sm"
            />
            <button 
              type="submit" 
              className="w-full bg-[#660000] text-white px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#7D0000] transition-all shadow-md cursor-pointer"
            >
              {t.footer.subscribe}
            </button>
          </form>
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
