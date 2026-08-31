"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Invoice, fetchMyOrders, payInvoice, updateUserProfile } from "@/lib/api";

export default function ProfileModal() {
  const { isProfileModalOpen, setProfileModalOpen, user, token, logout, language, refreshProfile } = useAppStore();

  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [address, setAddress] = useState(user?.address || "");
  const [postalCode, setPostalCode] = useState(user?.postalCode || "");
  const [orders, setOrders] = useState<Invoice[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setAddress(user.address || "");
      setPostalCode(user.postalCode || "");
    }
  }, [user]);

  useEffect(() => {
    if (isProfileModalOpen && token && activeTab === "orders") {
      loadOrders();
    }
  }, [isProfileModalOpen, token, activeTab]);

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const data = await fetchMyOrders(token);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  if (!isProfileModalOpen) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMsg(null);
    try {
      await updateUserProfile({ firstName, lastName, address, postalCode }, token);
      await refreshProfile();
      setMsg(language === "fa" ? "پروفایل با موفقیت بروزرسانی شد" : "Profile updated successfully");
    } catch (err: any) {
      setMsg(err.message || "خطا در بروزرسانی");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePay = async (invoiceId: number) => {
    try {
      await payInvoice(invoiceId, token);
      loadOrders();
    } catch (err: any) {
      alert(err.message || "خطا در پرداخت");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-white dark:bg-[#FAF9F5] border border-[#C4852B]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C4852B]/10 text-[#C4852B] flex items-center justify-center font-bold font-serif text-lg">
              {user?.firstName ? user.firstName[0] : "👤"}
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">
                {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : (user?.phoneNumber || "حساب کاربری")}
              </h2>
              <p className="text-xs text-zinc-500 font-mono">{user?.phoneNumber}</p>
            </div>
          </div>

          <button
            onClick={() => setProfileModalOpen(false)}
            className="p-1 text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-300 bg-zinc-50 dark:bg-[#F4F1EA] px-6 pt-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "profile"
                ? "border-[#C4852B] text-[#C4852B]"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {language === "fa" ? "اطلاعات حساب و آدرس" : "Profile & Address"}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "orders"
                ? "border-[#C4852B] text-[#C4852B]"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {language === "fa" ? "سفارش‌ها و فاکتورها" : "Orders & Invoices"}
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {msg && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-lg">
              {msg}
            </div>
          )}

          {activeTab === "profile" && (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    {language === "fa" ? "نام" : "First Name"}
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-[#C4852B] text-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    {language === "fa" ? "نام خانوادگی" : "Last Name"}
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-[#C4852B] text-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  {language === "fa" ? "آدرس تحویل سفارش" : "Shipping Address"}
                </label>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-[#C4852B] text-zinc-900"
                  placeholder={language === "fa" ? "تهران، خیابان..." : "City, Street..."}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  {language === "fa" ? "کد پستی ۱۰ رقمی" : "Postal Code"}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-[#C4852B] text-zinc-900 font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={logout}
                  className="text-xs text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                >
                  {language === "fa" ? "خروج از حساب کاربری" : "Log Out"}
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#C4852B] hover:bg-[#A36C20] text-white text-xs font-bold rounded-lg transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (language === "fa" ? "در حال ذخیره..." : "Saving...") : (language === "fa" ? "ذخیره تغییرات" : "Save Profile")}
                </button>
              </div>
            </form>
          )}

          {activeTab === "orders" && (
            <div>
              {isLoadingOrders ? (
                <div className="py-12 text-center text-xs text-zinc-500">
                  {language === "fa" ? "در حال بارگذاری فاکتورها..." : "Loading invoices..."}
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500">
                  {language === "fa" ? "هنوز سفارشی ثبت نکرده‌اید." : "No orders found."}
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((inv) => (
                    <div key={inv.id} className="p-4 border border-zinc-200 dark:border-zinc-300 rounded-xl bg-zinc-50/50 dark:bg-white">
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-200 text-xs">
                        <span className="font-bold text-zinc-800">
                          {language === "fa" ? `فاکتور شماره #${inv.id}` : `Invoice #${inv.id}`}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.isPaid 
                            ? "bg-green-100 text-green-800" 
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {inv.isPaid ? (language === "fa" ? "پرداخت شده" : "Paid") : (language === "fa" ? "در انتظار پرداخت" : "Pending Payment")}
                        </span>
                      </div>

                      <div className="py-3 space-y-1.5 text-xs text-zinc-600">
                        {inv.items?.map((it) => (
                          <div key={it.id} className="flex justify-between">
                            <span>{it.product?.name || "محصول نقره"} × {it.quantity}</span>
                            <span className="font-mono">{Number(it.calculatedPriceToman).toLocaleString()} تومان</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-zinc-200 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-zinc-500">{language === "fa" ? "مبلغ نهایی (با ۱۰٪ مالیات): " : "Total with VAT: "}</span>
                          <span className="text-sm font-bold text-[#C4852B] font-mono">
                            {Number(inv.finalTotalToman).toLocaleString()} تومان
                          </span>
                        </div>

                        {!inv.isPaid && (
                          <button
                            onClick={() => handlePay(inv.id)}
                            className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg shadow cursor-pointer transition-all"
                          >
                            {language === "fa" ? "پرداخت آزمایشی 💳" : "Mock Pay 💳"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
