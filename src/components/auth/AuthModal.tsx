"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { sendOtp } from "@/lib/api";

export default function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, loginWithOtp, loginAsAdmin, language } = useAppStore();
  
  const [mode, setMode] = useState<"user" | "admin">("user");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setAuthModalOpen(false);
    setErrorMsg(null);
    setSuccessMsg(null);
    setStep("phone");
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setErrorMsg(language === "fa" ? "لطفاً یک شماره موبایل معتبر وارد کنید" : "Please enter a valid phone number");
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await sendOtp(phone);
      setSuccessMsg(
        language === "fa"
          ? "کد تأیید ارسال شد (در محیط توسعه، کد در لاگ ترمینال بک‌اند نمایش داده می‌شود)"
          : "OTP sent! (In dev mode, check backend terminal console)"
      );
      setStep("code");
    } catch (err: any) {
      setErrorMsg(err.message || "خطا در ارسال کد");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 4) {
      setErrorMsg(language === "fa" ? "لطفاً کد تایید را کامل وارد کنید" : "Please enter the complete OTP code");
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await loginWithOtp(phone, code);
      handleClose();
    } catch (err: any) {
      setErrorMsg(err.message || "کد وارد شده صحیح نمی‌باشد");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await loginAsAdmin(username, password);
      handleClose();
    } catch (err: any) {
      setErrorMsg(err.message || "نام کاربری یا رمز عبور اشتباه است");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-[#FAF9F5] border border-[#C4852B]/30 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-900 transition-colors p-1"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header & Tabs */}
        <div className="text-center mb-6">
          <div className="inline-block p-3 rounded-full bg-[#C4852B]/10 text-[#C4852B] mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold font-serif text-zinc-900 tracking-wide">
            {language === "fa" ? "ورود به حساب کاربری" : "Account Login"}
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            {language === "fa" ? "فروشگاه اختصاصی زیورآلات نفیسه عبادی" : "Nafise Ebadi Fine Jewellery"}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex border border-zinc-200 dark:border-zinc-300 rounded-lg p-1 mt-4 bg-zinc-50 dark:bg-[#F4F1EA]">
            <button
              onClick={() => { setMode("user"); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === "user"
                  ? "bg-white dark:bg-white text-[#C4852B] shadow-sm font-bold"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {language === "fa" ? "ورود کاربر (پیامک OTP)" : "Customer Login (SMS)"}
            </button>
            <button
              onClick={() => { setMode("admin"); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                mode === "admin"
                  ? "bg-white dark:bg-white text-[#660000] shadow-sm font-bold"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {language === "fa" ? "ورود ادمین" : "Admin Portal"}
            </button>
          </div>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg flex items-center gap-2">
            <span>ℹ️</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* USER OTP FORM */}
        {mode === "user" && (
          <div>
            {step === "phone" ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                    {language === "fa" ? "شماره تلفن همراه" : "Mobile Phone Number"}
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    placeholder="09123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-[#C4852B] focus:ring-1 focus:ring-[#C4852B] text-center font-mono tracking-widest text-zinc-900"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#C4852B] hover:bg-[#A36C20] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isLoading 
                    ? (language === "fa" ? "در حال ارسال..." : "Sending...") 
                    : (language === "fa" ? "دریافت کد ورود" : "Send Verification Code")}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-medium text-zinc-700">
                      {language === "fa" ? "کد تأیید ۵ رقمی" : "5-Digit OTP Code"}
                    </label>
                    <button
                      type="button"
                      onClick={() => setStep("phone")}
                      className="text-[11px] text-[#C4852B] hover:underline cursor-pointer"
                    >
                      {language === "fa" ? "ویرایش شماره" : "Edit Phone"}
                    </button>
                  </div>
                  <input
                    type="text"
                    dir="ltr"
                    maxLength={6}
                    placeholder="12345"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-lg text-lg text-center font-mono tracking-[0.5em] font-bold focus:outline-none focus:border-[#C4852B] focus:ring-1 focus:ring-[#C4852B] text-zinc-900"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1.5 text-center">
                    {language === "fa" 
                      ? "💡 کد OTP در پنجره ترمینال بک‌اند چاپ شده است." 
                      : "💡 The OTP is printed in the backend terminal console."}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#C4852B] hover:bg-[#A36C20] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isLoading 
                    ? (language === "fa" ? "در حال بررسی..." : "Verifying...") 
                    : (language === "fa" ? "ورود به حساب" : "Verify & Sign In")}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ADMIN FORM */}
        {mode === "admin" && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                {language === "fa" ? "نام کاربری ادمین" : "Admin Username"}
              </label>
              <input
                type="text"
                dir="ltr"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-[#660000] focus:ring-1 focus:ring-[#660000] text-zinc-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                {language === "fa" ? "کلمه عبور" : "Password"}
              </label>
              <input
                type="password"
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-lg text-sm focus:outline-none focus:border-[#660000] focus:ring-1 focus:ring-[#660000] text-zinc-900 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#660000] hover:bg-[#4D0000] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isLoading 
                ? (language === "fa" ? "در حال احراز هویت..." : "Authenticating...") 
                : (language === "fa" ? "ورود به پنل مدیریت" : "Login to Admin Panel")}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
