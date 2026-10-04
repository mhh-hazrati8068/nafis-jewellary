"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { 
  BackendProduct, 
  BackendCategory,
  Invoice, 
  Article,
  fetchAdminProducts, 
  fetchCategories,
  fetchAdminInvoices, 
  forceUpdateSilverPrice,
  fetchArticles,
  fetchLiveSilverPrice,
  invalidateApiCache,
  API_BASE_URL
} from "@/lib/api";
import OfficialReceiptModal from "@/components/receipt/OfficialReceiptModal";
import styles from "./dashboard.module.css";

export default function AdminDashboardPage() {
  const { token, silverPricePerGramToman, fetchSilverPrice } = useAppStore();

  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncingPrice, setIsSyncingPrice] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Invoice Receipt Modal state
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [prodRes, invRes, catRes, artRes] = await Promise.allSettled([
        fetchAdminProducts(token),
        fetchAdminInvoices(token),
        fetchCategories(token),
        fetchArticles(token),
      ]);

      if (prodRes.status === "fulfilled") setProducts(prodRes.value || []);
      if (invRes.status === "fulfilled") setInvoices(invRes.value || []);
      if (catRes.status === "fulfilled") setCategories(catRes.value || []);
      if (artRes.status === "fulfilled") setArticles(artRes.value || []);

      await fetchSilverPrice();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در بارگذاری اطلاعات داشبورد");
    } finally {
      setIsLoading(false);
    }
  }, [token, fetchSilverPrice]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleForceUpdatePrice = async () => {
    setIsSyncingPrice(true);
    try {
      await forceUpdateSilverPrice(token);
      await fetchSilverPrice();
      alert("نرخ لحظه‌ای نقره با موفقیت از سامانه TGJU بروزرسانی شد.");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "خطا در بروزرسانی نرخ نقره");
    } finally {
      setIsSyncingPrice(false);
    }
  };

  const handleOpenReceipt = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsReceiptOpen(true);
  };

  const recentInvoices = invoices.slice(0, 6);
  const recentProducts = products.slice(0, 6);

  // Status Badge Class Helper
  const getStatusBadge = (status?: string, isPaid?: boolean) => {
    if (isPaid || status === "PAID" || status === "COMPLETED") {
      return <span className={`${styles.statusBadge} ${styles.paid}`}>پرداخت‌شده</span>;
    }
    if (status === "SHIPPED") {
      return <span className={`${styles.statusBadge} ${styles.shipped}`}>ارسال‌شده</span>;
    }
    if (status === "CANCELLED") {
      return <span className={`${styles.statusBadge} ${styles.cancelled}`}>لغوشده</span>;
    }
    return <span className={`${styles.statusBadge} ${styles.pending}`}>در انتظار پرداخت</span>;
  };

  return (
    <div className={styles.container}>
      {/* Welcome banner */}
      <div className={styles.welcomeBanner}>
        <div className={styles.welcomeText}>
          <h2>خوش آمدید، پنل مدیریت زیورآلات نفیسه عبادی</h2>
          <p>مدیریت جامع موجودی طلا و نقره، نرخ‌گذاری لحظه‌ای، فاکتورهای رسمی و مقالات دانشنامه تخصصی</p>
        </div>
        <button 
          onClick={async () => {
            invalidateApiCache();
            await loadDashboardData();
          }} 
          className={styles.refreshBtn} 
          disabled={isLoading}
        >
          <svg
            className={isLoading ? styles.spinning : ""}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          بروزرسانی داده‌ها
        </button>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          <span>{error}</span>
          <button onClick={loadDashboardData}>تلاش مجدد</button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className={styles.statsGrid}>
        {/* Products KPI */}
        <Link href="/admin/products" className={styles.statCard}>
          <div className={`${styles.iconWrap} ${styles.iconProducts}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
              <path d="M2 9h20" />
              <path d="M10 3l-2 6 4 12 4-12-2-6" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>کل محصولات</span>
            <span className={styles.statValue}>
              {isLoading ? "..." : products.length.toLocaleString("fa-IR")}
            </span>
            <span className={styles.statSub}>زیورآلات نقره و سنگ‌های اصیل</span>
          </div>
        </Link>

        {/* Invoices KPI */}
        <Link href="/admin/invoices" className={styles.statCard}>
          <div className={`${styles.iconWrap} ${styles.iconInvoices}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16l3-1.5 3 1.5 3-1.5 3 1.5 3-1.5 3 1.5V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>سفارش‌ها و فاکتورها</span>
            <span className={styles.statValue}>
              {isLoading ? "..." : invoices.length.toLocaleString("fa-IR")}
            </span>
            <span className={styles.statSub}>سفارشات ثبت‌شده مشتریان</span>
          </div>
        </Link>

        {/* Silver Price KPI */}
        <div className={styles.statCard}>
          <div className={`${styles.iconWrap} ${styles.iconSilver}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>نرخ لحظه‌ای نقره ۹۲۵</span>
            <span className={styles.statValue}>
              {silverPricePerGramToman ? Number(silverPricePerGramToman).toLocaleString("fa-IR") : "---"} ت
            </span>
            <span className={styles.statSub}>قیمت روز به ازای هر گرم (TGJU)</span>
          </div>
        </div>

        {/* Articles KPI */}
        <Link href="/admin/articles" className={styles.statCard}>
          <div className={`${styles.iconWrap} ${styles.iconArticles}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>مقالات دانشنامه</span>
            <span className={styles.statValue}>
              {isLoading ? "..." : articles.length.toLocaleString("fa-IR")}
            </span>
            <span className={styles.statSub}>مقالات تخصصی و گوهرشناسی</span>
          </div>
        </Link>
      </div>

      {/* Quick Actions Bar */}
      <div className={styles.quickActions}>
        <Link href="/admin/products?new=1" className={styles.actionBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>افزودن محصول جدید</span>
        </Link>

        <Link href="/admin/categories" className={styles.actionBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>تعریف دسته‌بندی جدید</span>
        </Link>

        <Link href="/admin/articles?new=1" className={styles.actionBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <span>ثبت مقاله دانشنامه</span>
        </Link>

        <button 
          onClick={handleForceUpdatePrice} 
          disabled={isSyncingPrice} 
          className={styles.actionBtn}
        >
          <svg 
            className={isSyncingPrice ? styles.spinning : ""} 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          <span>بروزرسانی فوری نرخ نقره</span>
        </button>

        <Link href="/admin/invoices" className={styles.actionBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
          <span>مشاهده همه سفارش‌ها</span>
        </Link>
      </div>

      {/* Recent Invoices Table */}
      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>آخرین سفارش‌ها و فاکتورها</h3>
            <p className={styles.cardSubtitle}>وضعیت تراکنش‌ها و سفارشات اخیر ثبت‌شده توسط مشتریان</p>
          </div>
          <Link href="/admin/invoices" className={styles.viewAllLink}>
            مشاهده همه سفارش‌ها ({invoices.length.toLocaleString("fa-IR")})
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
        </div>

        {invoices.length === 0 ? (
          <div className={styles.emptyState}>
            {isLoading ? "در حال بارگذاری اطلاعات..." : "هیچ سفارشی در سیستم ثبت نشده است."}
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>شناسه فاکتور</th>
                  <th>نام و اطلاعات خریدار</th>
                  <th>مبلغ نهایی</th>
                  <th>تاریخ ثبت</th>
                  <th>وضعیت سفارش</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((inv) => {
                  const clientName = inv.user?.firstName || inv.user?.lastName
                    ? `${inv.user.firstName || ""} ${inv.user.lastName || ""}`.trim()
                    : "مشتری فروشگاه";
                  const phone = inv.user?.phoneNumber || "---";
                  const dateStr = inv.createdAt 
                    ? new Date(inv.createdAt).toLocaleDateString("fa-IR")
                    : "امروز";

                  return (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: 700, color: "#660000" }}>
                        #{inv.id}
                      </td>
                      <td>
                        <div className={styles.clientCell}>
                          <span className={styles.clientName}>{clientName}</span>
                          <span className={styles.clientPhone}>{phone}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        {Number(inv.finalTotalToman || inv.subTotalToman || 0).toLocaleString("fa-IR")} تومان
                      </td>
                      <td className={styles.dateCell}>{dateStr}</td>
                      <td>{getStatusBadge(inv.orderStatus, inv.isPaid || inv.paid)}</td>
                      <td>
                        <button
                          onClick={() => handleOpenReceipt(inv)}
                          className={styles.actionBtnView}
                          title="مشاهده شناسنامه و فاکتور رسمی"
                        >
                          مشاهده فاکتور
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Products Table */}
      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>محصولات اخیر و موجودی انبار</h3>
            <p className={styles.cardSubtitle}>آخرین محصولات ثبت‌شده به همراه قیمت‌گذاری لحظه‌ای</p>
          </div>
          <Link href="/admin/products" className={styles.viewAllLink}>
            مشاهده همه محصولات ({products.length.toLocaleString("fa-IR")})
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className={styles.emptyState}>
            {isLoading ? "در حال دریافت محصولات..." : "محصولی یافت نشد."}
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>تصویر</th>
                  <th>نام محصول و دسته‌بندی</th>
                  <th>وزن نقره</th>
                  <th>قیمت زنده</th>
                  <th>موجودی</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((p) => {
                  const imgUrl = p.imageUrl 
                    ? (p.imageUrl.startsWith("http") ? p.imageUrl : `${API_BASE_URL}${p.imageUrl}`)
                    : "/images/placeholder-jewelry.png";

                  return (
                    <tr key={p.id}>
                      <td>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={imgUrl} 
                          alt={p.name} 
                          className={styles.productThumb} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&q=80";
                          }}
                        />
                      </td>
                      <td>
                        <div className={styles.productTitleCol}>
                          <span className={styles.productTitle}>{p.name}</span>
                          <span className={styles.productCategory}>{p.categoryName || p.category?.name || "نقره و جواهرات"}</span>
                        </div>
                      </td>
                      <td>{p.weight ? `${Number(p.weight).toLocaleString("fa-IR")} گرم` : "---"}</td>
                      <td style={{ fontWeight: 700, color: "#660000" }}>
                        {p.livePriceToman ? `${Number(p.livePriceToman).toLocaleString("fa-IR")} ت` : "محاسبه زنده"}
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${p.stockQuantity > 0 ? styles.paid : styles.cancelled}`}>
                          {p.stockQuantity > 0 ? `${Number(p.stockQuantity).toLocaleString("fa-IR")} عدد` : "ناموجود"}
                        </span>
                      </td>
                      <td>
                        <Link href={`/admin/products?edit=${p.id}`} className={styles.actionBtnView}>
                          ویرایش
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Official Luxury Receipt Modal */}
      <OfficialReceiptModal
        invoice={selectedInvoice}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
}
