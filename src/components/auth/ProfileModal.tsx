"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Invoice, fetchMyOrders, payInvoice, updateUserProfile } from "@/lib/api";
import IranLocationSelector from "@/components/ui/IranLocationSelector";
import JalaliDatePicker from "@/components/ui/JalaliDatePicker";

function ProfileModalContent() {
  const { setProfileModalOpen, user, token, logout, language, refreshProfile, setActiveReceiptInvoice } = useAppStore();

  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [province, setProvince] = useState(user?.province || "");
  const [city, setCity] = useState(user?.city || "");
  const [birthDate, setBirthDate] = useState(user?.birthDate || "");
  const [address, setAddress] = useState(user?.address || "");
  const [postalCode, setPostalCode] = useState(user?.postalCode || "");
  const [orders, setOrders] = useState<Invoice[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (user.firstName) setFirstName(user.firstName);
      if (user.lastName) setLastName(user.lastName);
      if (user.province) setProvince(user.province);
      if (user.city) setCity(user.city);
      if (user.birthDate) setBirthDate(user.birthDate);
      if (user.address) setAddress(user.address);
      if (user.postalCode) setPostalCode(user.postalCode);
    }
  }, [user]);

  const loadOrders = useCallback(async () => {
    if (!token) return;
    setIsLoadingOrders(true);
    try {
      const data = await fetchMyOrders(token);
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setIsLoadingOrders(false);
    }
  }, [token]);

  useEffect(() => {
    let ignore = false;
    if (token && activeTab === "orders") {
      fetchMyOrders(token)
        .then((data) => {
          if (!ignore) setOrders(data);
        })
        .catch((err) => {
          console.error("Failed to load orders:", err);
        })
        .finally(() => {
          if (!ignore) setIsLoadingOrders(false);
        });
    }
    return () => {
      ignore = true;
    };
  }, [token, activeTab]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMsg(null);
    try {
      await updateUserProfile({ 
        firstName, 
        lastName, 
        province, 
        city, 
        birthDate, 
        address, 
        postalCode 
      }, token);
      await refreshProfile();
      setMsg(language === "fa" ? "پروفایل با موفقیت بروزرسانی شد" : language === "ar" ? "تم تحديث الملف الشخصي بنجاح" : "Profile updated successfully");
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : "خطا در بروزرسانی";
      setMsg(errorText);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePay = async (invoiceId: number) => {
    try {
      await payInvoice(invoiceId, token);
      loadOrders();
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : "خطا در پرداخت";
      alert(errorText);
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
              <h3 className="font-bold text-base text-zinc-950">
                {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : (language === "fa" ? "حساب کاربری" : language === "ar" ? "الحساب الشخصي" : "User Account")}
              </h3>
              <p className="text-xs text-[#626667] font-mono">{user?.phoneNumber}</p>
            </div>
          </div>
          <button 
            onClick={() => setProfileModalOpen(false)}
            className="p-2 text-zinc-400 hover:text-[#660000] text-sm font-semibold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-zinc-200 bg-zinc-50 dark:bg-[#F4F1EA]">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === "profile" 
                ? "border-b-2 border-[#C4852B] text-[#C4852B] bg-white dark:bg-[#FAF9F5] font-bold" 
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            {language === "fa" ? "مشخصات و آدرس" : language === "ar" ? "البيانات والعنوان" : "Profile & Address"}
          </button>
          <button
            onClick={() => {
              setActiveTab("orders");
              if (orders.length === 0) setIsLoadingOrders(true);
            }}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === "orders" 
                ? "border-b-2 border-[#C4852B] text-[#C4852B] bg-white dark:bg-[#FAF9F5] font-bold" 
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            {language === "fa" ? "سفارش‌ها و فاکتورها" : language === "ar" ? "الطلبات والفواتير" : "Orders & Invoices"}
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === "profile" ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {msg && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-lg font-medium">
                  {msg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    {language === "fa" ? "نام" : language === "ar" ? "الاسم" : "First Name"}
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs focus:outline-none focus:border-[#C4852B] text-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    {language === "fa" ? "نام خانوادگی" : language === "ar" ? "اسم العائلة" : "Last Name"}
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs focus:outline-none focus:border-[#C4852B] text-zinc-900"
                  />
                </div>
              </div>

              {/* Jalali Date of Birth */}
              <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <JalaliDatePicker
                  value={birthDate}
                  onChange={(isoDate) => setBirthDate(isoDate)}
                  label={language === "fa" ? "تاریخ تولد (تقویم خورشیدی)" : language === "ar" ? "تاريخ الميلاد (التقويم الشمسي)" : "Date of Birth (Solar Hijri)"}
                />
              </div>

              {/* Client-Side Static Province & City Selector */}
              <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl">
                <IranLocationSelector
                  selectedProvince={province}
                  selectedCity={city}
                  onChange={({ province: p, city: c }) => {
                    setProvince(p);
                    setCity(c);
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  {language === "fa" ? "نشانی دقیق پستی (خیابان، کوچه، پلاک، واحد)" : language === "ar" ? "عنوان التوصيل التفصيلي" : "Street Address & Details"}
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={language === "fa" ? "خیابان، کوچه، پلاک، طبقه، واحد..." : language === "ar" ? "الشارع، المبنى، الشقة..." : "Street, Building, Unit..."}
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs focus:outline-none focus:border-[#C4852B] text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  {language === "fa" ? "کد پستی ۱۰ رقمی" : language === "ar" ? "الرمز البريدي" : "Postal Code"}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs font-mono focus:outline-none focus:border-[#C4852B] text-zinc-900"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#C4852B] hover:bg-[#A76E1F] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving 
                    ? (language === "fa" ? "در حال ذخیره..." : language === "ar" ? "جاري الحفظ..." : "Saving...") 
                    : (language === "fa" ? "ذخیره تغییرات" : language === "ar" ? "حفظ التغييرات" : "Save Changes")}
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="text-xs text-[#660000] hover:underline font-bold cursor-pointer"
                >
                  {language === "fa" ? "خروج از حساب کاربری" : language === "ar" ? "تسجيل الخروج" : "Sign Out"}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {isLoadingOrders ? (
                <div className="py-12 text-center text-xs text-[#626667]">
                  <span className="inline-block animate-spin text-lg mb-2">⌛</span>
                  <p>{language === "fa" ? "در حال بارگذاری فاکتورها..." : language === "ar" ? "جاري تحميل الفواتير..." : "Loading orders..."}</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#626667]">
                  <span className="text-3xl block mb-2">🧾</span>
                  <p>{language === "fa" ? "هنوز سفارشی ثبت نکرده‌اید." : language === "ar" ? "لم تقم بتسجيل أي طلب بعد." : "No orders found."}</p>
                </div>
              ) : (
                orders.map((invoice) => (
                  <div 
                    key={invoice.id}
                    className="p-4 rounded-xl bg-white border border-zinc-200 space-y-3 text-xs shadow-xs"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-950">
                          {language === "fa" ? `فاکتور شماره #${invoice.id}` : `Invoice #${invoice.id}`}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          invoice.isPaid 
                            ? "bg-green-100 text-green-800" 
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {invoice.isPaid 
                            ? (language === "fa" ? "پرداخت شده" : language === "ar" ? "تم الدفع" : "Paid") 
                            : (language === "fa" ? "در انتظار پرداخت" : language === "ar" ? "بانتظار الدفع" : "Pending Payment")}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#626667] font-mono">
                        {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : ""}
                      </span>
                    </div>

                    <div className="space-y-1 text-[#626667]">
                      {invoice.items?.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span>{item.product?.name} × {item.quantity}</span>
                          <span className="font-mono">{Number(item.calculatedPriceToman).toLocaleString()} تومان</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-100 font-bold">
                      <span className="text-zinc-950">
                        {language === "fa" ? "مبلغ کل:" : language === "ar" ? "المجموع الكلي:" : "Total:"}
                      </span>
                      <span className="font-mono text-sm text-[#C4852B]">
                        {Number(invoice.finalTotalToman).toLocaleString()} تومان
                      </span>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => setActiveReceiptInvoice(invoice)}
                        className="flex-1 py-2 bg-[#C4852B] hover:bg-[#A76E1F] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <span>🧾</span>
                        <span>{language === "fa" ? "مشاهده رسید رسمی سازمان" : language === "ar" ? "عرض الإيصال الرسمي" : "Official Receipt"}</span>
                      </button>

                      {!invoice.isPaid && (
                        <button
                          onClick={() => handlePay(invoice.id)}
                          className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-2xs"
                        >
                          {language === "fa" ? "💳 پرداخت" : language === "ar" ? "💳 دفع" : "💳 Pay"}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function ProfileModal() {
  const { isProfileModalOpen, user } = useAppStore();
  if (!isProfileModalOpen) return null;
  return <ProfileModalContent key={user?.id || "profile-open"} />;
}
