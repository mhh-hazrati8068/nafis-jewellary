"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { getAdminUser, removeAdminSession } from "@/lib/adminAuth";
import { forceUpdateSilverPrice } from "@/lib/api";
import styles from "./AdminTopBar.module.css";

const pageTitles: Record<string, string> = {
  "/admin": "داشبورد مدیریت",
  "/admin/products": "مدیریت محصولات و قیمت‌گذاری",
  "/admin/categories": "دسته‌بندی‌ها",
  "/admin/invoices": "سفارش‌ها و فاکتورها",
  "/admin/articles": "مقالات و دانشنامه تخصصی",
};

export default function AdminTopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { silverPricePerGramToman, fetchSilverPrice, token, logout } = useAppStore();
  const [adminUser, setAdminUser] = useState<{ username?: string; role?: string } | null>(null);
  const [todayDate, setTodayDate] = useState<string>("");
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);

  useEffect(() => {
    setAdminUser(getAdminUser());
    try {
      const now = new Intl.DateTimeFormat("fa-IR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date());
      setTodayDate(now);
    } catch {
      setTodayDate(new Date().toLocaleDateString("fa-IR"));
    }
  }, []);

  const handleForceUpdatePrice = async () => {
    setIsUpdatingPrice(true);
    try {
      await forceUpdateSilverPrice(token);
      await fetchSilverPrice();
    } catch (err: unknown) {
      console.warn("Could not force update silver price:", err);
    } finally {
      setIsUpdatingPrice(false);
    }
  };

  const handleLogout = () => {
    removeAdminSession();
    logout();
    router.replace("/admin/login");
  };

  const title = pageTitles[pathname] || "پنل مدیریت پرتال";

  return (
    <header className={styles.topBar}>
      <div className={styles.leftInfo}>
        <h1 className={styles.pageTitle}>{title}</h1>
        {todayDate && <span className={styles.dateLabel}>{todayDate}</span>}
      </div>

      <div className={styles.userSection}>
        {/* Live silver price pill */}
        <div className={styles.silverPill}>
          <span className={styles.silverPillLabel}>نقره ۹۲۵:</span>
          <span className={styles.silverPillPrice}>
            {silverPricePerGramToman ? Number(silverPricePerGramToman).toLocaleString("fa-IR") : "---"} ت
          </span>
          <button
            onClick={handleForceUpdatePrice}
            disabled={isUpdatingPrice}
            className={`${styles.silverRefreshBtn} ${isUpdatingPrice ? styles.spinning : ""}`}
            title="بروزرسانی زنده نرخ نقره از اتحادیه (TGJU)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
          </button>
        </div>

        {/* Admin User Badge */}
        <div className={styles.adminBadge}>
          <div className={styles.avatar}>
            <span>ن</span>
          </div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{adminUser?.username || "مدیر سیستم"}</span>
            <span className={styles.userRole}>{adminUser?.role || "مدیر ارشد"}</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={styles.logoutBtn}
          title="خروج از حساب کاربری"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className={styles.logoutText}>خروج</span>
        </button>
      </div>
    </header>
  );
}
