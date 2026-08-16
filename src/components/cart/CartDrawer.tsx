"use client";

import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";

export default function CartDrawer() {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, t, language } = useAppStore();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 500;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div 
      className={`fixed inset-0 z-[110] transition-all duration-300 ${
        isCartOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div 
        onClick={() => toggleCart(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer Panel — Docked cleanly to the Right edge in both LTR & RTL */}
      <div 
        className="fixed top-0 bottom-0 right-0 w-full max-w-md bg-[#FAF9F5] text-zinc-900 h-full flex flex-col shadow-2xl z-10 border-l border-[#C4852B]/30 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: isCartOpen ? "translateX(0)" : "translateX(100%)"
        }}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-brand-en tracking-wider uppercase font-bold text-zinc-950">{t.cartDrawer.title}</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#C4852B]/20 text-[#C4852B] text-xs font-mono font-bold">
              {cart.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>
          <button 
            onClick={() => toggleCart(false)}
            className="p-2 text-zinc-500 hover:text-[#660000] transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="px-6 py-3 bg-[#F4F1EA] border-b border-[#C4852B]/20 text-xs">
          {subtotal >= freeShippingThreshold ? (
            <p className="text-[#C4852B] font-semibold flex items-center gap-2">
              <span>✨</span>
              <span>{t.cartDrawer.freeShippingQualified}</span>
            </p>
          ) : (
            <p className="text-[#626667]">
              {language === 'fa' 
                ? `فقط $${(freeShippingThreshold - subtotal).toFixed(2)} دیگر تا ارسال رایگان بیمه‌شده` 
                : `Add $${(freeShippingThreshold - subtotal).toFixed(2)} more for free insured delivery`}
            </p>
          )}
          <div className="w-full h-1.5 bg-zinc-200 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#C4852B] to-[#660000] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-[#626667]">
              <span className="text-4xl mb-3">🛍️</span>
              <p className="text-sm font-semibold mb-1">{t.cartDrawer.emptyTitle}</p>
              <p className="text-xs mb-6">{t.cartDrawer.emptyDesc}</p>
              <button 
                onClick={() => toggleCart(false)}
                className="px-6 py-2.5 bg-[#660000] text-white font-semibold text-xs uppercase tracking-widest rounded-full hover:bg-[#7D0000] transition-all cursor-pointer"
              >
                {t.hero.explore}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.id}
                className="flex gap-4 p-4 rounded-xl bg-white border border-zinc-200 relative group shadow-xs"
              >
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg bg-[#F4F1EA]"
                />

                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm text-zinc-950 pr-4">{item.name}</h4>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-400 hover:text-[#660000] text-xs transition-colors cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                    {item.material && (
                      <span className="text-[10px] text-[#626667] block font-mono">{item.material}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-zinc-300 rounded-lg bg-white">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2 py-0.5 text-xs text-[#626667] hover:text-zinc-900 transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-mono font-bold text-zinc-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2 py-0.5 text-xs text-[#626667] hover:text-zinc-900 transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-mono text-sm font-bold text-[#C4852B]">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Subtotal & Checkout */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-zinc-200 bg-[#FAF9F5] flex flex-col gap-4">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-zinc-600 uppercase tracking-wider">{t.cartDrawer.subtotal}</span>
              <span className="font-mono text-lg text-[#C4852B] font-bold">${subtotal.toLocaleString()}</span>
            </div>
            
            <p className="text-[10px] text-[#626667] text-center">
              {t.cartDrawer.taxNotice}
            </p>

            <Link 
              href="/shop" 
              onClick={() => toggleCart(false)}
              className="w-full py-4 bg-[#660000] text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl text-center shadow-lg hover:bg-[#7D0000] transition-all cursor-pointer"
            >
              {t.cartDrawer.checkout}
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
