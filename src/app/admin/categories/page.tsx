"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import {
  BackendCategory,
  BackendProduct,
  fetchCategories,
  createAdminCategory,
  fetchAdminProducts,
  invalidateApiCache,
} from "@/lib/api";
import styles from "./categories.module.css";

export default function AdminCategoriesPage() {
  const { token } = useAppStore();
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Category Form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [cats, prods] = await Promise.all([
        fetchCategories(token),
        fetchAdminProducts(token),
      ]);
      setCategories(cats || []);
      setProducts(prods || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در دریافت لیست دسته‌بندی‌ها");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setStatusMsg(null);
    try {
      await createAdminCategory(name.trim(), description.trim() || undefined, token);
      setName("");
      setDescription("");
      setStatusMsg({ text: "دسته‌بندی با موفقیت افزوده شد.", type: "success" });
      await loadData();
    } catch (err: unknown) {
      setStatusMsg({
        text: err instanceof Error ? err.message : "خطا در افزودن دسته‌بندی جدید",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to count products for each category
  const getProductCount = (catId: number) => {
    return products.filter(
      (p) => p.categoryId === catId || p.category?.id === catId
    ).length;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>مدیریت دسته‌بندی‌ها</h1>
          <p className={styles.subtitle}>دسته‌بندی‌های زیورآلات نقره، نگین‌ها و اقلام فروشگاه</p>
        </div>
        <button 
          onClick={async () => {
            invalidateApiCache('categories');
            invalidateApiCache('admin_products');
            await loadData();
          }} 
          className={styles.refreshBtn} 
          disabled={isLoading}
        >
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

      {statusMsg && (
        <div className={statusMsg.type === "success" ? styles.successAlert : styles.errorAlert}>
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Add Category Form Card */}
      <div className={styles.formCard}>
        <h3>تعریف دسته‌بندی جدید</h3>
        <form onSubmit={handleCreateCategory} className={styles.inlineForm}>
          <input
            type="text"
            required
            className={styles.inputName}
            placeholder="نام دسته‌بندی (مثلاً انگشتر نقره مردانه)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className={styles.inputDesc}
            placeholder="توضیحات کوتاه اختیاری"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? "در حال ثبت..." : "افزودن دسته‌بندی"}
          </button>
        </form>
      </div>

      {/* Categories Table Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "80px" }}>شناسه</th>
                <th>نام دسته‌بندی</th>
                <th>توضیحات</th>
                <th style={{ width: "160px" }}>تعداد محصولات</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span className={styles.catIdBadge}>#{c.id}</span>
                  </td>
                  <td>
                    <span className={styles.catName}>{c.name}</span>
                  </td>
                  <td>
                    <span className={styles.catDesc}>{c.description || "---"}</span>
                  </td>
                  <td>
                    <span className={styles.productCountBadge}>
                      {getProductCount(c.id).toLocaleString("fa-IR")} محصول
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
