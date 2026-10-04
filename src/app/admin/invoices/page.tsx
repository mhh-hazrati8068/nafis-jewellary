"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Invoice, fetchAdminInvoices, updateInvoiceStatus } from "@/lib/api";
import OfficialReceiptModal from "@/components/receipt/OfficialReceiptModal";
import styles from "./invoices.module.css";

const statusTabs = [
  { id: "all", label: "همه سفارش‌ها" },
  { id: "PENDING", label: "در انتظار پرداخت" },
  { id: "PAID", label: "پرداخت‌شده" },
  { id: "PROCESSING", label: "در حال پردازش" },
  { id: "SHIPPED", label: "ارسال‌شده" },
  { id: "DELIVERED", label: "تحویل داده شده" },
  { id: "CANCELLED", label: "لغوشده" },
];

export default function AdminInvoicesPage() {
  const { token } = useAppStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Official Receipt Modal state
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const invList = await fetchAdminInvoices(token);
      setInvoices(invList || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در دریافت لیست سفارش‌ها");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChangeStatus = async (invoiceId: number, newStatus: string) => {
    try {
      await updateInvoiceStatus(invoiceId, newStatus, token);
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === invoiceId ? { ...inv, orderStatus: newStatus } : inv
        )
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "خطا در تغییر وضعیت سفارش");
    }
  };

  const handleOpenReceipt = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsReceiptOpen(true);
  };

  // Filter invoices based on activeTab
  const filteredInvoices = invoices.filter((inv) => {
    if (activeTab === "all") return true;
    if (activeTab === "PAID") return inv.isPaid || inv.paid || inv.orderStatus === "PAID";
    if (activeTab === "PENDING") return !inv.isPaid && !inv.paid && (inv.orderStatus === "PENDING" || !inv.orderStatus);
    return inv.orderStatus === activeTab;
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>مدیریت سفارش‌ها و فاکتورها</h1>
          <p className={styles.subtitle}>پیگیری سفارشات، صدور شناسنامه و فاکتور رسمی زیورآلات و تغییر وضعیت ارسال</p>
        </div>
        <button onClick={loadData} className={styles.refreshBtn} disabled={isLoading}>
          <svg
            className={isLoading ? styles.spinning : ""}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          بروزرسانی
        </button>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          <span>{error}</span>
          <button onClick={loadData}>تلاش مجدد</button>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className={styles.tabsBar}>
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Invoices Table Card */}
      <div className={styles.tableCard}>
        {filteredInvoices.length === 0 ? (
          <div className={styles.emptyState}>
            {isLoading ? "در حال دریافت فاکتورها..." : "سفارشی در این وضعیت یافت نشد."}
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>شناسه فاکتور</th>
                  <th>خریدار</th>
                  <th>اقلام سفارش</th>
                  <th>مبلغ نهایی (تومان)</th>
                  <th>آدرس تحویل</th>
                  <th>تاریخ</th>
                  <th>وضعیت سفارش</th>
                  <th>فاکتور رسمی</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => {
                  const clientName = inv.user?.firstName || inv.user?.lastName
                    ? `${inv.user.firstName || ""} ${inv.user.lastName || ""}`.trim()
                    : "مشتری فروشگاه";
                  const phone = inv.user?.phoneNumber || "---";
                  const dateStr = inv.createdAt
                    ? new Date(inv.createdAt).toLocaleDateString("fa-IR")
                    : "امروز";

                  const currentStatus = inv.orderStatus || (inv.isPaid || inv.paid ? "PAID" : "PENDING");

                  return (
                    <tr key={inv.id}>
                      <td>
                        <span className={styles.invoiceId}>#{inv.id}</span>
                      </td>
                      <td>
                        <div className={styles.clientCell}>
                          <span className={styles.clientName}>{clientName}</span>
                          <span className={styles.clientPhone}>{phone}</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.itemsSummary}>
                          {inv.items && inv.items.length > 0 ? (
                            inv.items.map((item) => (
                              <span key={item.id} className={styles.itemLine}>
                                • {item.product?.name || "محصول نقره"} (×{item.quantity})
                              </span>
                            ))
                          ) : (
                            <span>بدون اقلام</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={styles.priceCol}>
                          {Number(inv.finalTotalToman || inv.subTotalToman || 0).toLocaleString("fa-IR")} ت
                        </span>
                      </td>
                      <td>
                        <div className={styles.addressCol}>
                          {inv.shippingAddress || inv.user?.address || "---"}
                          {inv.postalCode ? ` (کد پستی: ${inv.postalCode})` : ""}
                        </div>
                      </td>
                      <td style={{ color: "#626667", whiteSpace: "nowrap" }}>{dateStr}</td>
                      <td>
                        <select
                          className={styles.statusSelect}
                          value={currentStatus}
                          onChange={(e) => handleChangeStatus(inv.id, e.target.value)}
                        >
                          <option value="PENDING">در انتظار پرداخت</option>
                          <option value="PAID">پرداخت‌شده</option>
                          <option value="PROCESSING">در حال آماده‌سازی</option>
                          <option value="SHIPPED">ارسال‌شده با پست</option>
                          <option value="DELIVERED">تحویل مشتری شده</option>
                          <option value="CANCELLED">لغوشده</option>
                        </select>
                      </td>
                      <td>
                        <button
                          onClick={() => handleOpenReceipt(inv)}
                          className={styles.actionBtnReceipt}
                          title="مشاهده و چاپ شناسنامه رسمی فاکتور"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 6 2 18 2 18 9" />
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                            <rect x="6" y="14" width="12" height="8" />
                          </svg>
                          فاکتور رسمی
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

      {/* Official Receipt Modal */}
      <OfficialReceiptModal
        invoice={selectedInvoice}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
}
