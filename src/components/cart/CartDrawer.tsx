"use client";

import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";
import { createCheckout, payInvoice, Invoice } from "@/lib/api";

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    toggleCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    t, 
    language, 
    token, 
    user, 
    setAuthModalOpen,
    setProfileModalOpen 
  } = useAppStore();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [address, setAddress] = useState(user?.address || "");
  const [postalCode, setPostalCode] = useState(user?.postalCode || "");
  const [isLoading, setIsLoading] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const subtotalToman = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxToman = Math.round(subtotalToman * 0.10); // 10% VAT
  const finalTotalToman = subtotalToman + taxToman;

  const handleStartCheckout = () => {
    if (!token) {
      setAuthModalOpen(true);
      return;
    }
    if (user?.address) setAddress(user.address);
    if (user?.postalCode) setPostalCode(user.postalCode);
    setIsCheckingOut(true);
    setErrorMsg(null);
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !postalCode.trim()) {
      setErrorMsg(language === "fa" ? "لطفاً آدرس و کدپستی را وارد کنید" : "Please enter address and postal code");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const itemsMap: Record<number, number> = {};
      cart.forEach((item) => {
        itemsMap[item.id] = item.quantity;
      });

      const invoice = await createCheckout(itemsMap, address, postalCode, token);
      setCreatedInvoice(invoice);
      clearCart();
      setIsCheckingOut(false);
    } catch (err: any) {
      setErrorMsg(err.message || "خطا در ثبت سفارش");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMockPayment = async () => {
    if (!createdInvoice) return;
    setIsLoading(true);
    try {
      await payInvoice(createdInvoice.id, token);
      alert(language === "fa" ? "پرداخت با موفقیت شبیه‌سازی شد! فاکتور تسویه گردید." : "Payment successful! Invoice settled.");
      setCreatedInvoice(null);
      toggleCart(false);
      setProfileModalOpen(true);
    } catch (err: any) {
      alert(err.message || "خطا در پرداخت");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[110] transition-all duration-300 ${
        isCartOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div 
        onClick={() => { toggleCart(false); setCreatedInvoice(null); setIsCheckingOut(false); }}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer Panel */}
      <div 
        className="fixed top-0 bottom-0 right-0 w-full max-w-md bg-[#FAF9F5] text-zinc-900 h-full flex flex-col shadow-2xl z-10 border-l border-[#C4852B]/30 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: isCartOpen ? "translateX(0)" : "translateX(100%)"
        }}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-brand-en tracking-wider uppercase font-bold text-zinc-950">
              {createdInvoice 
                ? (language === "fa" ? "فاکتور صادر شده" : "Generated Invoice") 
                : t.cartDrawer.title}
            </h2>
            {!createdInvoice && (
              <span className="px-2 py-0.5 rounded-full bg-[#C4852B]/20 text-[#C4852B] text-xs font-mono font-bold">
                {cart.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            )}
          </div>
          <button 
            onClick={() => { toggleCart(false); setCreatedInvoice(null); setIsCheckingOut(false); }}
            className="p-2 text-zinc-500 hover:text-[#660000] transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* INVOICE SUCCESS VIEW */}
        {createdInvoice ? (
          <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                <span className="text-3xl block mb-1">🧾</span>
                <h3 className="font-bold text-green-900 text-sm">
                  {language === "fa" ? `فاکتور شماره #${createdInvoice.id} با موفقیت صادر شد` : `Invoice #${createdInvoice.id} Created`}
                </h3>
                <p className="text-[11px] text-green-700 mt-1">
                  {language === "fa" ? "سفارش شما در پایگاه‌داده ثبت گردید." : "Your order is saved in the database."}
                </p>
              </div>

              <div className="p-4 bg-white border border-zinc-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-zinc-100 text-zinc-600">
                  <span>{language === "fa" ? "خریدار:" : "Customer:"}</span>
                  <span className="font-mono">{createdInvoice.user?.phoneNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100 text-zinc-600">
                  <span>{language === "fa" ? "آدرس:" : "Address:"}</span>
                  <span className="text-right">{createdInvoice.shippingAddress}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100 text-zinc-600">
                  <span>{language === "fa" ? "کد پستی:" : "Postal Code:"}</span>
                  <span className="font-mono">{createdInvoice.postalCode}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100 text-zinc-600">
                  <span>{language === "fa" ? "جمع اقلام:" : "Subtotal:"}</span>
                  <span className="font-mono">{Number(createdInvoice.subTotalToman).toLocaleString()} تومان</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100 text-zinc-600">
                  <span>{language === "fa" ? "مالیات بر ارزش افزوده (۱۰٪):" : "VAT (10%):"}</span>
                  <span className="font-mono">{Number(createdInvoice.taxAmountToman).toLocaleString()} تومان</span>
                </div>
                <div className="flex justify-between py-1.5 font-bold text-sm text-[#C4852B]">
                  <span>{language === "fa" ? "مبلغ کل قابل پرداخت:" : "Total Payable:"}</span>
                  <span className="font-mono">{Number(createdInvoice.finalTotalToman).toLocaleString()} تومان</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <button
                onClick={handleMockPayment}
                disabled={isLoading}
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl text-center shadow-lg transition-all cursor-pointer"
              >
                {isLoading ? "در حال اتصال به درگاه..." : "💳 پرداخت تستی و تسویه فاکتور (Mock Pay)"}
              </button>
              <button
                onClick={() => { toggleCart(false); setCreatedInvoice(null); setProfileModalOpen(true); }}
                className="w-full py-2.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                {language === "fa" ? "مشاهده در سوابق سفارشات" : "View in Order History"}
              </button>
            </div>
          </div>
        ) : isCheckingOut ? (
          /* CHECKOUT ADDRESS FORM */
          <form onSubmit={handleConfirmOrder} className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                <span className="text-xs font-bold text-zinc-900">
                  {language === "fa" ? "اطلاعات ارسال سفارش" : "Shipping Details"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="text-[11px] text-[#C4852B] hover:underline cursor-pointer"
                >
                  {language === "fa" ? "بازگشت به سبد" : "Back to Cart"}
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  {language === "fa" ? "نشانی دقیق پستی" : "Shipping Address"}
                </label>
                <textarea
                  rows={3}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={language === "fa" ? "استان، شهر، خیابان، پلاک، واحد..." : "City, Street, Building..."}
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs focus:outline-none focus:border-[#C4852B] text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  {language === "fa" ? "کد پستی" : "Postal Code"}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="1234567890"
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs font-mono focus:outline-none focus:border-[#C4852B] text-zinc-900"
                />
              </div>

              <div className="p-3 bg-[#F4F1EA] rounded-lg text-xs space-y-1">
                <div className="flex justify-between text-zinc-600">
                  <span>{language === "fa" ? "مجموع سبد:" : "Subtotal:"}</span>
                  <span className="font-mono">{subtotalToman.toLocaleString()} تومان</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>{language === "fa" ? "مالیات بر ارزش افزوده (۱۰٪):" : "VAT (10%):"}</span>
                  <span className="font-mono">{taxToman.toLocaleString()} تومان</span>
                </div>
                <div className="flex justify-between font-bold text-zinc-900 pt-1 border-t border-zinc-200">
                  <span>{language === "fa" ? "مبلغ نهایی فاکتور:" : "Final Total:"}</span>
                  <span className="font-mono text-[#C4852B]">{finalTotalToman.toLocaleString()} تومان</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#660000] hover:bg-[#7D0000] text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl text-center shadow-lg transition-all cursor-pointer disabled:opacity-50 mt-4"
            >
              {isLoading 
                ? (language === "fa" ? "در حال صدور فاکتور..." : "Generating Invoice...") 
                : (language === "fa" ? "تأیید و صدور فاکتور نهایی" : "Confirm & Create Invoice")}
            </button>
          </form>
        ) : (
          /* NORMAL CART ITEMS LIST */
          <>
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
                          {(item.price * item.quantity).toLocaleString()} تومان
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Subtotal & Checkout Button */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-zinc-200 bg-[#FAF9F5] flex flex-col gap-4">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-zinc-600 uppercase tracking-wider">{t.cartDrawer.subtotal}</span>
                  <span className="font-mono text-lg text-[#C4852B] font-bold">
                    {subtotalToman.toLocaleString()} تومان
                  </span>
                </div>
                
                <p className="text-[10px] text-[#626667] text-center">
                  {language === "fa" ? "محاسبه خودکار ۱۰٪ مالیات بر ارزش افزوده در مرحله صدور فاکتور" : "10% VAT automatically calculated at checkout"}
                </p>

                <button 
                  onClick={handleStartCheckout}
                  className="w-full py-4 bg-[#660000] text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl text-center shadow-lg hover:bg-[#7D0000] transition-all cursor-pointer"
                >
                  {token ? (language === "fa" ? "ثبت سفارش و صدور فاکتور" : "Proceed to Checkout") : (language === "fa" ? "ورود به حساب و ثبت سفارش" : "Login to Checkout")}
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
