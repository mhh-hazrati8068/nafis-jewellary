"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import {
  Article,
  fetchArticles,
  saveAdminArticle,
  deleteAdminArticle,
  invalidateApiCache,
  API_BASE_URL,
} from "@/lib/api";
import styles from "./articles.module.css";

export default function AdminArticlesPage() {
  const { token } = useAppStore();
  const searchParams = useSearchParams();

  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const artList = await fetchArticles(token);
      setArticles(artList || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در دریافت مقالات");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const isNew = searchParams.get("new");
    if (isNew) {
      handleOpenCreate();
    }
  }, [searchParams]);

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setContent("");
    setImageFile(null);
    setImagePreviewUrl(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (art: Article) => {
    setEditingArticle(art);
    setTitle(art.title || "");
    setSlug(art.slug || "");
    setSummary(art.summary || "");
    setContent(art.content || "");
    setImageFile(null);
    setImagePreviewUrl(
      art.imageUrl
        ? art.imageUrl.startsWith("http")
          ? art.imageUrl
          : `${API_BASE_URL}${art.imageUrl}`
        : null
    );
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingArticle && !slug) {
      setSlug(val.trim().toLowerCase().replace(/\s+/g, "-"));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setFormError("لطفاً عنوان و متن کامل مقاله را وارد کنید.");
      return;
    }
    setIsSaving(true);
    setFormError(null);

    try {
      const generatedSlug = slug.trim()
        ? slug.trim().toLowerCase().replace(/\s+/g, "-")
        : title.trim().toLowerCase().replace(/\s+/g, "-");

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("slug", generatedSlug);
      formData.append("summary", summary.trim());
      formData.append("content", content.trim());

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await saveAdminArticle(
        formData,
        !!editingArticle,
        editingArticle?.id,
        token
      );

      setIsModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "خطا در ذخیره مقاله");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (!window.confirm("آیا از حذف این مقاله اطمینان دارید؟")) return;
    try {
      await deleteAdminArticle(id, token);
      await loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "خطا در حذف مقاله");
    }
  };

  const filteredArticles = articles.filter(
    (a) =>
      !searchQuery ||
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>مدیریت مقالات و دانشنامه</h1>
          <p className={styles.subtitle}>نگارش و انتشار مقالات تخصصی گوهرشناسی، نقره ۹۲۵ و راهنمای نگهداری زیورآلات</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            onClick={async () => {
              invalidateApiCache('articles');
              invalidateApiCache('article_');
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
          <button onClick={handleOpenCreate} className={styles.createBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            افزودن مقاله جدید
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          <span>{error}</span>
          <button onClick={loadData}>تلاش مجدد</button>
        </div>
      )}

      {/* Search Bar */}
      <div className={styles.searchBox}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جستجو در عنوان یا متن مقالات..."
        />
      </div>

      {/* Articles Table Card */}
      <div className={styles.tableCard}>
        {filteredArticles.length === 0 ? (
          <div className={styles.emptyState}>
            {isLoading ? "در حال دریافت مقالات..." : "مقاله‌ای یافت نشد."}
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>عنوان و تصویر مقاله</th>
                  <th>چکیده و خلاصه</th>
                  <th>تاریخ ثبت</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((art) => {
                  const imgUrl = art.imageUrl
                    ? art.imageUrl.startsWith("http")
                      ? art.imageUrl
                      : `${API_BASE_URL}${art.imageUrl}`
                    : "/images/placeholder-jewelry.png";

                  const dateStr = art.createdAt
                    ? new Date(art.createdAt).toLocaleDateString("fa-IR")
                    : "---";

                  return (
                    <tr key={art.id}>
                      <td>
                        <div className={styles.articleCell}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgUrl}
                            alt={art.title}
                            className={styles.thumb}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=100&q=80";
                            }}
                          />
                          <div className={styles.articleInfo}>
                            <span className={styles.articleTitle}>{art.title}</span>
                            <span className={styles.articleSlug}>{art.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.summaryCol}>
                          {art.summary || "بدون خلاصه"}
                        </div>
                      </td>
                      <td style={{ color: "#626667", whiteSpace: "nowrap" }}>{dateStr}</td>
                      <td>
                        <div className={styles.actionsCell}>
                          <button
                            onClick={() => handleOpenEdit(art)}
                            className={styles.actionBtnEdit}
                          >
                            ویرایش
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art.id)}
                            className={styles.actionBtnDelete}
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Article Add / Edit Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => !isSaving && setIsModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingArticle ? "ویرایش مقاله دانشنامه" : "نگارش مقاله دانشنامه جدید"}
              </h2>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className={styles.modalBody}>
              {formError && (
                <div className={styles.errorAlert}>
                  <span>{formError}</span>
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.label}>عنوان مقاله *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="مثال: روش‌های تشخیص عقیق یمنی اصل از سنگ‌های صنعتی"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>نامک یکتا (Slug انگلیسی یا فارسی)</label>
                <input
                  type="text"
                  dir="ltr"
                  className={styles.input}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="agate-identification-guide"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>چکیده و معرفی کوتاه مقاله</label>
                <input
                  type="text"
                  className={styles.input}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="خلاصه‌ای از مباحث مقاله برای نمایش در کارت دانشنامه..."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>متن کامل مقاله *</label>
                <textarea
                  required
                  className={styles.textarea}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="محتوا، توضیحات، مشخصات سنگ و نکات تخصصی را اینجا بنویسید..."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>تصویر شاخص مقاله</label>
                <div className={styles.imageUploadBox}>
                  {imagePreviewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imagePreviewUrl} alt="Preview" className={styles.imagePreview} />
                  ) : (
                    <div
                      className={styles.imagePreview}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#8c9096" }}
                    >
                      بدون عکس
                    </div>
                  )}
                  <label className={styles.fileInputLabel}>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span>{imageFile ? "تغییر تصویر" : "آپلود تصویر شاخص"}</span>
                  </label>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                >
                  انصراف
                </button>
                <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <svg className={styles.spinning} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      <span>در حال ذخیره...</span>
                    </>
                  ) : (
                    <span>ذخیره مقاله</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
