"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import {
  BackendProduct,
  BackendCategory,
  fetchAdminProducts,
  fetchAllProducts,
  fetchAdminStones,
  fetchCategories,
  saveAdminProduct,
  deleteAdminProduct,
  invalidateApiCache,
  API_BASE_URL,
} from "@/lib/api";
import styles from "./products.module.css";

export default function AdminProductsPage() {
  const { token, silverPricePerGramToman, fetchProducts, fetchSilverPrice } = useAppStore();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [stones, setStones] = useState<BackendProduct[]>([]);
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [selectedStockFilter, setSelectedStockFilter] = useState("all");
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState("all");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BackendProduct | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Product Form Fields (NO default values as per system law)
  const [name, setName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [pricingMethod, setPricingMethod] = useState<string>("METHOD_1_SILVER_MAKING_STONE");
  const [weight, setWeight] = useState<string>(""); // Strictly empty by default
  const [makingCharge, setMakingCharge] = useState<string>(""); // Strictly empty by default (in Tomans)
  const [fixedPrice, setFixedPrice] = useState<string>("");
  const [stonePrice, setStonePrice] = useState<string>("");
  const [selectedStoneId, setSelectedStoneId] = useState<string>("");
  const [stockQuantity, setStockQuantity] = useState<string>("");
  const [badge, setBadge] = useState<string>("NONE");
  const [isVisible, setIsVisible] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [prodList, publicList, stoneList, catList] = await Promise.all([
        fetchAdminProducts(token),
        fetchAllProducts(null, token),
        fetchAdminStones(token),
        fetchCategories(token),
      ]);

      const publicPriceMap = new Map<number, number>();
      (publicList || []).forEach((p) => {
        if (p.id && typeof p.livePriceToman === "number" && p.livePriceToman > 0) {
          publicPriceMap.set(p.id, p.livePriceToman);
        }
      });

      const currentSilverRate = silverPricePerGramToman || 540040;

      const enrichedProducts = (prodList || []).map((p) => {
        const serverLivePrice = publicPriceMap.get(p.id);
        let finalLivePrice = serverLivePrice || p.livePriceToman;

        if (!finalLivePrice) {
          if (p.pricingMethod === "METHOD_3_FIXED_PRICE") {
            finalLivePrice = Number(p.fixedPrice || 0);
          } else if (p.pricingMethod === "METHOD_4_STONE_ONLY") {
            finalLivePrice = Number(p.stonePrice || 0);
          } else {
            const w = Number(p.weight || 0);
            const rawSilver = Math.round(w * currentSilverRate);
            const mkPct = Number(p.makingChargePercentage || 0);
            const makingTotal = Math.round(rawSilver * (mkPct / 100) * 2);
            const stPrice = p.pricingMethod === "METHOD_1_SILVER_MAKING_STONE"
              ? Number(p.stonePrice || p.stone?.stonePrice || p.stone?.livePriceToman || 0)
              : 0;
            finalLivePrice = rawSilver + makingTotal + stPrice;
          }
        }

        return {
          ...p,
          livePriceToman: finalLivePrice,
        };
      });

      setProducts(enrichedProducts);
      setStones(stoneList || []);
      setCategories(catList || []);
      await fetchSilverPrice();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در دریافت لیست محصولات");
    } finally {
      setIsLoading(false);
    }
  }, [token, fetchSilverPrice, silverPricePerGramToman]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle URL query parameters (e.g. ?new=1 or ?edit=12)
  useEffect(() => {
    const isNew = searchParams.get("new");
    const editId = searchParams.get("edit");
    if (isNew) {
      handleOpenCreate();
    } else if (editId && products.length > 0) {
      const prod = products.find((p) => String(p.id) === editId);
      if (prod) handleOpenEdit(prod);
    }
  }, [searchParams, products]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName("");
    setSelectedCategoryId(categories[0]?.id ? String(categories[0].id) : "");
    setPricingMethod("METHOD_1_SILVER_MAKING_STONE");
    // Strictly empty as per system law: "اجرت ساخت هر گرم برای هر محصول باید به صورت دستی وارد شود. سیستم هیچ مقدار پیش‌فرضی ندارد"
    setWeight("");
    setMakingCharge("");
    setFixedPrice("");
    setStonePrice("");
    setSelectedStoneId("");
    setStockQuantity("");
    setBadge("NONE");
    setIsVisible(true);
    setImageFiles([]);
    setImagePreviews([]);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: BackendProduct) => {
    setEditingProduct(prod);
    setName(prod.name || "");
    const catId = prod.categoryId
      ? String(prod.categoryId)
      : prod.category?.id
      ? String(prod.category.id)
      : "";
    setSelectedCategoryId(catId);
    setPricingMethod(prod.pricingMethod || "METHOD_1_SILVER_MAKING_STONE");
    setWeight(prod.weight !== undefined && prod.weight !== null ? String(prod.weight) : "");
    setMakingCharge(
      prod.makingChargePercentage !== undefined && prod.makingChargePercentage !== null
        ? String(prod.makingChargePercentage)
        : ""
    );
    setFixedPrice(prod.fixedPrice ? String(prod.fixedPrice) : "");
    setStonePrice(prod.stonePrice ? String(prod.stonePrice) : "");
    setSelectedStoneId(prod.stone?.id ? String(prod.stone.id) : "");
    setStockQuantity(
      prod.stockQuantity !== undefined && prod.stockQuantity !== null
        ? String(prod.stockQuantity)
        : ""
    );
    setBadge(prod.badge || "NONE");
    setIsVisible(prod.isVisible ?? prod.visible ?? true);
    setImageFiles([]);
    
    // Populate existing images (main image + gallery)
    const existingPreviews: string[] = [];
    if (prod.imageUrl) {
      existingPreviews.push(
        prod.imageUrl.startsWith("http")
          ? prod.imageUrl
          : `${API_BASE_URL}${prod.imageUrl}`
      );
    }
    if (Array.isArray(prod.galleryImages)) {
      for (const g of prod.galleryImages) {
        if (g) {
          const u = g.startsWith("http") ? g : `${API_BASE_URL}${g}`;
          if (!existingPreviews.includes(u)) existingPreviews.push(u);
        }
      }
    }
    setImagePreviews(existingPreviews);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...selected]);
      const newUrls = selected.map((f) => URL.createObjectURL(f));
      setImagePreviews((prev) => [...prev, ...newUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Synchronize stone price if an existing stone is chosen from the list
  const handleSelectStone = (stoneIdStr: string) => {
    setSelectedStoneId(stoneIdStr);
    if (stoneIdStr) {
      const found = stones.find((s) => String(s.id) === stoneIdStr);
      if (found) {
        const p = found.stonePrice || found.livePriceToman || 0;
        setStonePrice(String(p));
      }
    } else {
      setStonePrice("");
    }
  };

  const selectedStone = useMemo(() => {
    return stones.find((s) => String(s.id) === selectedStoneId);
  }, [stones, selectedStoneId]);

  // Step-by-Step Transparent Live Price Calculation Breakdown
  const calcDetails = useMemo(() => {
    const silverRate = silverPricePerGramToman || 540040;
    const w = parseFloat(weight) || 0;
    const mkPercent = parseFloat(makingCharge) || 0; // In Percentage (e.g. 15 for 15%)

    // In Method 1, get stone price directly from the selected stone product in stones list
    const foundStone = stones.find((s) => String(s.id) === selectedStoneId);
    const selectedStoneVal = foundStone
      ? Number(foundStone.stonePrice || foundStone.livePriceToman || 0)
      : (parseFloat(stonePrice) || 0);

    const fixVal = parseFloat(fixedPrice) || 0;
    const stVal = parseFloat(stonePrice) || 0;

    if (pricingMethod === "METHOD_3_FIXED_PRICE") {
      return {
        silverRate,
        silverRawValue: 0,
        makingChargePercent: 0,
        makingTotalValue: 0,
        stoneValue: 0,
        finalTotal: fixVal,
      };
    }

    if (pricingMethod === "METHOD_4_STONE_ONLY") {
      return {
        silverRate,
        silverRawValue: 0,
        makingChargePercent: 0,
        makingTotalValue: 0,
        stoneValue: stVal,
        finalTotal: stVal,
      };
    }

    // Methods 1 & 2:
    // وزن نقره خام = وزن محصول × قیمت روز نقره
    const silverRaw = Math.round(w * silverRate);
    // اجرت ساخت به درصد با ضریب ۲ = ارزش نقره خام × (درصد اجرت / ۱۰۰) × ۲
    const makingTotal = Math.round(silverRaw * (mkPercent / 100) * 2);
    const effectiveStone = pricingMethod === "METHOD_1_SILVER_MAKING_STONE" ? selectedStoneVal : 0;
    const finalPrice = silverRaw + makingTotal + effectiveStone;

    return {
      silverRate,
      silverRawValue: silverRaw,
      makingChargePercent: mkPercent,
      makingTotalValue: makingTotal,
      stoneValue: effectiveStone,
      finalTotal: finalPrice,
    };
  }, [silverPricePerGramToman, weight, makingCharge, stonePrice, fixedPrice, pricingMethod, selectedStoneId, stones]);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("لطفاً نام محصول را وارد کنید.");
      return;
    }

    // Validation according to system law
    if (
      (pricingMethod === "METHOD_1_SILVER_MAKING_STONE" ||
        pricingMethod === "METHOD_2_SILVER_MAKING")
    ) {
      if (!weight || parseFloat(weight) <= 0) {
        setFormError("لطفاً وزن محصول را به گرم به صورت دستی وارد نمایید.");
        return;
      }
      if (!makingCharge || parseFloat(makingCharge) <= 0) {
        setFormError(
          "⚠️ قانون سیستم: درصد اجرت ساخت باید به صورت دستی وارد شود و نمی‌تواند خالی باشد."
        );
        return;
      }
    }

    if (pricingMethod === "METHOD_1_SILVER_MAKING_STONE" && !selectedStoneId) {
      setFormError("لطفاً یک سنگ / نگین را از لیست انتخاب نمایید.");
      return;
    }

    if (pricingMethod === "METHOD_3_FIXED_PRICE" && (!fixedPrice || parseFloat(fixedPrice) <= 0)) {
      setFormError("لطفاً قیمت مقطوع و ثابت محصول را به تومان وارد نمایید.");
      return;
    }

    if (pricingMethod === "METHOD_4_STONE_ONLY" && (!stonePrice || parseFloat(stonePrice) <= 0)) {
      setFormError("لطفاً قیمت سنگ را به تومان وارد نمایید.");
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("pricingMethod", pricingMethod);
      formData.append("weight", weight || "0");
      // The server model maps the manual making charge as percentage
      formData.append("makingChargePercentage", makingCharge || "0");
      formData.append("fixedPrice", fixedPrice || "0");

      if (pricingMethod === "METHOD_1_SILVER_MAKING_STONE") {
        const foundStone = stones.find((s) => String(s.id) === selectedStoneId);
        const sPrice = foundStone ? (foundStone.stonePrice || foundStone.livePriceToman || 0) : 0;
        formData.append("stonePrice", String(sPrice));
      } else if (pricingMethod === "METHOD_4_STONE_ONLY") {
        formData.append("stonePrice", stonePrice || "0");
      } else {
        formData.append("stonePrice", "0");
      }

      formData.append("stockQuantity", stockQuantity || "0");
      formData.append("badge", badge);
      formData.append("isVisible", String(isVisible));
      formData.append("visible", String(isVisible));

      if (selectedCategoryId) {
        formData.append("categoryId", selectedCategoryId);
      }

      // Backend accepts multiple images under the key "images"
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append("images", imageFiles[i]);
      }

      const stoneIdNumber = selectedStoneId ? Number(selectedStoneId) : undefined;
      const categoryIdNumber = selectedCategoryId ? Number(selectedCategoryId) : undefined;

      await saveAdminProduct(
        formData,
        !!editingProduct,
        editingProduct?.id,
        stoneIdNumber,
        categoryIdNumber,
        token
      );

      setIsModalOpen(false);
      await loadData();
      await fetchProducts();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "خطا در ذخیره محصول");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("آیا از حذف این محصول اطمینان دارید؟")) return;
    try {
      await deleteAdminProduct(id, token);
      await loadData();
      await fetchProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "خطا در حذف محصول");
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === "all" ||
      String(p.categoryId) === selectedCategoryFilter ||
      String(p.category?.id) === selectedCategoryFilter;

    const matchesStock =
      selectedStockFilter === "all" ||
      (selectedStockFilter === "in_stock" && p.stockQuantity > 0) ||
      (selectedStockFilter === "out_of_stock" && p.stockQuantity <= 0);

    const matchesBadge =
      selectedBadgeFilter === "all" || (p.badge || "NONE") === selectedBadgeFilter;

    return matchesSearch && matchesCategory && matchesStock && matchesBadge;
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>مدیریت محصولات</h1>
          <p className={styles.subtitle}>ثبت، ویرایش و قیمت‌گذاری بر اساس فرمول‌های رسمی طلا و نقره</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            onClick={async () => {
              invalidateApiCache('products_');
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
          <button onClick={handleOpenCreate} className={styles.createBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            افزودن محصول جدید
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          <span>{error}</span>
          <button onClick={loadData}>تلاش مجدد</button>
        </div>
      )}

      {/* Filters Bar */}
      <div className={styles.filtersBar}>
        <div className={styles.searchForm}>
          <div className={styles.searchBox}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو بر اساس نام محصول یا دسته‌بندی..."
            />
          </div>
        </div>

        <div className={styles.filtersRow}>
          {/* Category Filter */}
          <select
            className={styles.filterSelect}
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          >
            <option value="all">همه دسته‌بندی‌ها</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            className={styles.filterSelect}
            value={selectedStockFilter}
            onChange={(e) => setSelectedStockFilter(e.target.value)}
          >
            <option value="all">همه وضعیت‌های موجودی</option>
            <option value="in_stock">موجود در انبار</option>
            <option value="out_of_stock">ناموجود</option>
          </select>

          {/* Badge Filter */}
          <select
            className={styles.filterSelect}
            value={selectedBadgeFilter}
            onChange={(e) => setSelectedBadgeFilter(e.target.value)}
          >
            <option value="all">همه نشان‌های لوکس</option>
            <option value="SPECIAL_OFFER">پیشنهاد ویژه</option>
            <option value="BEST_SELLER">پرفروش‌ترین</option>
            <option value="NEW_ARRIVAL">محصول جدید</option>
            <option value="NONE">بدون نشان</option>
          </select>
        </div>
      </div>

      {/* Products Table Card */}
      <div className={styles.tableCard}>
        {filteredProducts.length === 0 ? (
          <div className={styles.emptyState}>
            {isLoading ? "در حال دریافت محصولات..." : "محصولی مطابق فیلترهای انتخابی یافت نشد."}
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>محصول و دسته‌بندی</th>
                  <th>فرمول قیمت‌گذاری</th>
                  <th>قیمت زنده سرور (تومان)</th>
                  <th>موجودی</th>
                  <th>نشان لوکس</th>
                  <th>وضعیت نمایش</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const imgUrl = p.imageUrl
                    ? (p.imageUrl.startsWith("http") ? p.imageUrl : `${API_BASE_URL}${p.imageUrl}`)
                    : "/images/placeholder-jewelry.png";

                  return (
                    <tr key={p.id}>
                      <td>
                        <div className={styles.productCell}>
                          <div style={{ position: "relative", display: "inline-block" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgUrl}
                              alt={p.name}
                              className={styles.thumb}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&q=80";
                              }}
                            />
                            {p.galleryImages && p.galleryImages.length > 0 && (
                              <span
                                style={{
                                  position: "absolute",
                                  bottom: "-3px",
                                  right: "-3px",
                                  background: "#1e293b",
                                  color: "#ffffff",
                                  fontSize: "9.5px",
                                  fontWeight: 800,
                                  padding: "1px 5px",
                                  borderRadius: "6px",
                                  boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                                }}
                                title={`شامل ${p.galleryImages.length} عکس گالری`}
                              >
                                +{p.galleryImages.length}
                              </span>
                            )}
                          </div>
                          <div className={styles.productInfo}>
                            <span className={styles.productName}>{p.name}</span>
                            <span className={styles.categoryTag}>
                              {p.categoryName || p.category?.name || "بدون دسته‌بندی"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.methodLabel}>
                          {p.pricingMethod === "METHOD_3_FIXED_PRICE" ? (
                            <span>روش ۳ (محصول آماده): {Number(p.fixedPrice || 0).toLocaleString("fa-IR")} ت</span>
                          ) : p.pricingMethod === "METHOD_4_STONE_ONLY" ? (
                            <span>روش ۴ (سنگ تنها): {Number(p.stonePrice || 0).toLocaleString("fa-IR")} ت</span>
                          ) : p.pricingMethod === "METHOD_2_SILVER_MAKING" ? (
                            <>
                              <span>روش ۲ | وزن: {p.weight ?? 0} گرم</span> |{" "}
                              <span>اجرت: {Number(p.makingChargePercentage ?? 0)}٪</span>
                            </>
                          ) : (
                            <>
                              <span>روش ۱ | وزن: {p.weight ?? 0} گرم</span> |{" "}
                              <span>اجرت: {Number(p.makingChargePercentage ?? 0)}٪</span>
                              {(p.stoneName || p.stone?.name) ? ` | نگین: ${p.stoneName || p.stone?.name}` : ""}
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={styles.priceVal}>
                          {p.livePriceToman && p.livePriceToman > 0
                            ? `${Math.round(p.livePriceToman).toLocaleString("fa-IR")} تومان`
                            : "در حال استعلام"}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.stockBadge} ${p.stockQuantity > 0 ? styles.inStock : styles.outStock}`}>
                          {p.stockQuantity > 0 ? `${Number(p.stockQuantity).toLocaleString("fa-IR")} عدد` : "ناموجود"}
                        </span>
                      </td>
                      <td>
                        {p.badge === "SPECIAL_OFFER" && <span className={`${styles.badgeTag} ${styles.badgeOffer}`}>پیشنهاد ویژه</span>}
                        {p.badge === "BEST_SELLER" && <span className={`${styles.badgeTag} ${styles.badgeSeller}`}>پرفروش‌ترین</span>}
                        {p.badge === "NEW_ARRIVAL" && <span className={`${styles.badgeTag} ${styles.badgeNew}`}>جدید</span>}
                        {(!p.badge || p.badge === "NONE") && <span className={`${styles.badgeTag} ${styles.badgeNone}`}>عادی</span>}
                      </td>
                      <td>
                        <span className={`${styles.visibilityBadge} ${(p.isVisible ?? p.visible ?? true) ? styles.visible : styles.hidden}`}>
                          {(p.isVisible ?? p.visible ?? true) ? "فعال در سایت" : "مخفی"}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionsCell}>
                          <button onClick={() => handleOpenEdit(p)} className={styles.actionBtnEdit}>
                            ویرایش
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id)} className={styles.actionBtnDelete}>
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

      {/* Product Add / Edit Modal with Flowchart System */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => !isSaving && setIsModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingProduct ? "ویرایش مشخصات و قیمت‌گذاری محصول" : "افزودن محصول جدید به سیستم"}
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

            <form onSubmit={handleSaveProduct} className={styles.modalBody}>
              {/* Important System Law Alert Box (Flowchart Banner) */}
              <div className={styles.systemLawBanner}>
                <div className={styles.systemLawIcon}>⚠️</div>
                <div className={styles.systemLawText}>
                  <span className={styles.systemLawTitle}>قانون مهم سیستم قیمت‌گذاری:</span>
                  <span className={styles.systemLawDesc}>
                    اجرت ساخت هر محصول باید به صورت درصد دستی (Manual) وارد شود. سیستم هیچ مقدار پیش‌فرضی برای اجرت ندارد.
                  </span>
                </div>
              </div>

              {formError && (
                <div className={styles.errorAlert}>
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. Method Selector Grid (4 Flowchart Columns) */}
              <div className={styles.methodSection}>
                <span className={styles.methodSectionTitle}>
                  <span>🎯</span>
                  <span>انتخاب روش قیمت‌گذاری بر اساس نوع محصول</span>
                </span>

                <div className={styles.methodsGrid}>
                  {/* Method 1: Blue */}
                  <div
                    className={`${styles.methodCard} ${styles.methodCard1} ${
                      pricingMethod === "METHOD_1_SILVER_MAKING_STONE" ? styles.methodCardActive1 : ""
                    }`}
                    onClick={() => setPricingMethod("METHOD_1_SILVER_MAKING_STONE")}
                  >
                    <div className={styles.methodCardHeader}>
                      <span className={`${styles.methodBadge} ${styles.badge1}`}>روش ۱</span>
                      <div className={`${styles.checkRadio} ${
                        pricingMethod === "METHOD_1_SILVER_MAKING_STONE" ? styles.checkRadioChecked : ""
                      }`} />
                    </div>
                    <h3 className={styles.methodCardTitle}>نقره + اجرت ساخت + سنگ قرآنی / نگین</h3>
                    <p className={styles.methodCardExample}>مانند گردن‌آویز گلبرگ، انگشتر نگین‌دار</p>
                    <div className={styles.methodCardFormula}>
                      (وزن × نرخ نقره) + (ارزش نقره × اجرت٪ × ۲) + قیمت استعلامی سنگ
                    </div>
                  </div>

                  {/* Method 2: Green */}
                  <div
                    className={`${styles.methodCard} ${styles.methodCard2} ${
                      pricingMethod === "METHOD_2_SILVER_MAKING" ? styles.methodCardActive2 : ""
                    }`}
                    onClick={() => setPricingMethod("METHOD_2_SILVER_MAKING")}
                  >
                    <div className={styles.methodCardHeader}>
                      <span className={`${styles.methodBadge} ${styles.badge2}`}>روش ۲</span>
                      <div className={`${styles.checkRadio} ${
                        pricingMethod === "METHOD_2_SILVER_MAKING" ? styles.checkRadioChecked : ""
                      }`} />
                    </div>
                    <h3 className={styles.methodCardTitle}>نقره + اجرت ساخت (بدون سنگ)</h3>
                    <p className={styles.methodCardExample}>مانند زنجیر سوپر ابریشمی، النگو، حلقه نقره</p>
                    <div className={styles.methodCardFormula}>
                      (وزن × نرخ نقره) + (ارزش نقره × اجرت٪ × ۲)
                    </div>
                  </div>

                  {/* Method 3: Orange */}
                  <div
                    className={`${styles.methodCard} ${styles.methodCard3} ${
                      pricingMethod === "METHOD_3_FIXED_PRICE" ? styles.methodCardActive3 : ""
                    }`}
                    onClick={() => setPricingMethod("METHOD_3_FIXED_PRICE")}
                  >
                    <div className={styles.methodCardHeader}>
                      <span className={`${styles.methodBadge} ${styles.badge3}`}>روش ۳</span>
                      <div className={`${styles.checkRadio} ${
                        pricingMethod === "METHOD_3_FIXED_PRICE" ? styles.checkRadioChecked : ""
                      }`} />
                    </div>
                    <h3 className={styles.methodCardTitle}>محصول آماده / پکیج</h3>
                    <p className={styles.methodCardExample}>مانند تابلو ازدواج، باکس هدیه نفیس</p>
                    <div className={styles.methodCardFormula}>
                      قیمت مقطوع تعیین‌شده برای کل محصول (شامل نقره + سنگ + تابلو)
                    </div>
                  </div>

                  {/* Method 4: Purple */}
                  <div
                    className={`${styles.methodCard} ${styles.methodCard4} ${
                      pricingMethod === "METHOD_4_STONE_ONLY" ? styles.methodCardActive4 : ""
                    }`}
                    onClick={() => setPricingMethod("METHOD_4_STONE_ONLY")}
                  >
                    <div className={styles.methodCardHeader}>
                      <span className={`${styles.methodBadge} ${styles.badge4}`}>روش ۴</span>
                      <div className={`${styles.checkRadio} ${
                        pricingMethod === "METHOD_4_STONE_ONLY" ? styles.checkRadioChecked : ""
                      }`} />
                    </div>
                    <h3 className={styles.methodCardTitle}>فروش تنها سنگ</h3>
                    <p className={styles.methodCardExample}>سنگ عقیق یمنی، دُرّ نجف اصل، سنگ خام یا حکاکی</p>
                    <div className={styles.methodCardFormula}>
                      قیمت سنگ + ۱۰٪ مالیات بر ارزش افزوده (بدون نقره و اجرت)
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Common Fields: Name & Category */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>نام محصول *</label>
                  <input
                    type="text"
                    required
                    className={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: گردن‌آویز نقره گلبرگ با نگین عقیق"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>دسته‌بندی</label>
                  <select
                    className={styles.select}
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                  >
                    <option value="">انتخاب دسته‌بندی</option>
                    {categories.map((c) => (
                      <option key={c.id} value={String(c.id)}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Method-Specific Fields */}
              {/* Methods 1 & 2: Weight & Making Charge per gram */}
              {(pricingMethod === "METHOD_1_SILVER_MAKING_STONE" ||
                pricingMethod === "METHOD_2_SILVER_MAKING") && (
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <span>وزن محصول (گرم) *</span>
                      <span className={styles.labelHint}>(دستی وارد شود)</span>
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      required
                      className={`${styles.input} ${styles.inputHighlight}`}
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="مثال: 5.920"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <span>درصد اجرت ساخت (%) *</span>
                      <span className={styles.labelHint}>(به درصد وارد شود - ضریب ۲ محاسبه می‌شود)</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      className={`${styles.input} ${styles.inputHighlight}`}
                      value={makingCharge}
                      onChange={(e) => setMakingCharge(e.target.value)}
                      placeholder="مثال: 15 یا 20"
                    />
                  </div>
                </div>
              )}

              {/* Method 1: Stone Selection (Direct from server inventory) */}
              {pricingMethod === "METHOD_1_SILVER_MAKING_STONE" && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <span>انتخاب سنگ / نگین از انبار محصولات *</span>
                    <span className={styles.labelHint}>(قیمت سنگ به صورت خودکار از سرور دریافت می‌شود)</span>
                  </label>
                  <select
                    required
                    className={`${styles.select} ${styles.inputHighlight}`}
                    value={selectedStoneId}
                    onChange={(e) => handleSelectStone(e.target.value)}
                  >
                    <option value="">-- لطفاً یک نگین یا سنگ از انبار انتخاب کنید --</option>
                    {stones.map((s) => {
                      const sPrice = Number(s.stonePrice || s.livePriceToman || 0);
                      return (
                        <option key={s.id} value={String(s.id)}>
                          {s.name} {sPrice > 0 ? `— [قیمت سرور: ${sPrice.toLocaleString("fa-IR")} تومان]` : ""}
                        </option>
                      );
                    })}
                  </select>

                  {selectedStone && (
                    <div style={{
                      marginTop: "6px",
                      padding: "10px 14px",
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      borderRadius: "10px",
                      fontSize: "13px",
                      color: "#1e40af",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      <span>💎 نگین انتخاب‌شده: <strong>{selectedStone.name}</strong></span>
                      <span style={{ direction: "ltr", fontWeight: 800 }}>
                        قیمت نگین در سرور: {Number(selectedStone.stonePrice || selectedStone.livePriceToman || 0).toLocaleString("fa-IR")} تومان
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Method 3: Fixed Product Price */}
              {pricingMethod === "METHOD_3_FIXED_PRICE" && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <span>قیمت تعیین‌شده برای محصول (تومان) *</span>
                    <span className={styles.labelHint}>(شامل نقره + سنگ + تابلو + بسته‌بندی)</span>
                  </label>
                  <input
                    type="number"
                    required
                    className={`${styles.input} ${styles.inputHighlight}`}
                    value={fixedPrice}
                    onChange={(e) => setFixedPrice(e.target.value)}
                    placeholder="مثال: 35000000"
                  />
                </div>
              )}

              {/* Method 4: Stone Only Price */}
              {pricingMethod === "METHOD_4_STONE_ONLY" && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <span>قیمت سنگ خام یا حکاکی (تومان) *</span>
                    <span className={styles.labelHint}>(بدون نقره و اجرت ساخت)</span>
                  </label>
                  <input
                    type="number"
                    required
                    className={`${styles.input} ${styles.inputHighlight}`}
                    value={stonePrice}
                    onChange={(e) => setStonePrice(e.target.value)}
                    placeholder="مثال: 7500000"
                  />
                </div>
              )}

              {/* 4. Transparent Live Breakdown Card (Flowchart Step-by-Step) */}
              <div className={styles.calcBreakdownCard}>
                <div className={styles.calcHeader}>
                  <span className={styles.calcHeaderTitle}>
                    <span>🧾</span>
                    <span>پیش‌نمایش تفکیک محاسباتی و صدور فاکتور (مطابق فرمول زنده سرور)</span>
                  </span>
                  <span className={styles.silverRateBadge}>
                    نرخ روز نقره: {calcDetails.silverRate.toLocaleString("fa-IR")} ت / گرم
                  </span>
                </div>

                <div className={styles.calcRows}>
                  {/* Silver Raw Value */}
                  {(pricingMethod === "METHOD_1_SILVER_MAKING_STONE" ||
                    pricingMethod === "METHOD_2_SILVER_MAKING") && (
                    <>
                      <div className={styles.calcRow}>
                        <span className={styles.calcRowLabel}>ارزش نقره خام:</span>
                        <span className={styles.calcRowFormula}>
                          ({weight || "۰"} گرم × {calcDetails.silverRate.toLocaleString("fa-IR")} ت)
                        </span>
                        <span className={styles.calcRowVal}>
                          {calcDetails.silverRawValue.toLocaleString("fa-IR")} تومان
                        </span>
                      </div>

                      <div className={styles.calcRow}>
                        <span className={styles.calcRowLabel}>اجرت ساخت دو برابری:</span>
                        <span className={styles.calcRowFormula}>
                          (ارزش نقره × {calcDetails.makingChargePercent || "۰"}٪ × ۲)
                        </span>
                        <span className={styles.calcRowVal}>
                          {calcDetails.makingTotalValue.toLocaleString("fa-IR")} تومان
                        </span>
                      </div>
                    </>
                  )}

                  {/* Stone Price */}
                  {pricingMethod === "METHOD_1_SILVER_MAKING_STONE" && (
                    <div className={styles.calcRow}>
                      <span className={styles.calcRowLabel}>قیمت نگین متصل‌شده (استعلام از سرور):</span>
                      <span className={styles.calcRowFormula}>
                        {selectedStone ? `(${selectedStone.name})` : "(بدون نگین)"}
                      </span>
                      <span className={styles.calcRowVal}>
                        {calcDetails.stoneValue.toLocaleString("fa-IR")} تومان
                      </span>
                    </div>
                  )}

                  {pricingMethod === "METHOD_4_STONE_ONLY" && (
                    <div className={styles.calcRow}>
                      <span className={styles.calcRowLabel}>قیمت سنگ خام / تراش‌خورده:</span>
                      <span className={styles.calcRowVal}>
                        {calcDetails.stoneValue.toLocaleString("fa-IR")} تومان
                      </span>
                    </div>
                  )}

                  {pricingMethod === "METHOD_3_FIXED_PRICE" && (
                    <div className={styles.calcRow}>
                      <span className={styles.calcRowLabel}>قیمت مقطوع تعیین‌شده:</span>
                      <span className={styles.calcRowVal}>
                        {calcDetails.finalTotal.toLocaleString("fa-IR")} تومان
                      </span>
                    </div>
                  )}

                  {/* Final Total Row */}
                  <div className={styles.calcTotalRow}>
                    <span className={styles.calcTotalLabel}>
                      💰 مبلغ کل و نهایی محصول (محاسبه رسمی سرور):
                    </span>
                    <span className={styles.calcTotalVal}>
                      {calcDetails.finalTotal.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Stock & Luxury Badge */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>موجودی در انبار</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    placeholder="مثال: 10"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>نشان ویژه محصول</label>
                  <select
                    className={styles.select}
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                  >
                    <option value="NONE">بدون نشان (عادی)</option>
                    <option value="SPECIAL_OFFER">پیشنهاد ویژه</option>
                    <option value="BEST_SELLER">پرفروش‌ترین</option>
                    <option value="NEW_ARRIVAL">محصول جدید</option>
                  </select>
                </div>
              </div>

              {/* 6. Multiple Images Upload */}
              <div className={styles.formGroup}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label className={styles.label}>
                    <span>تصاویر محصول (عکس اصلی + گالری)</span>
                    <span className={styles.labelHint}>(انتخاب همزمان چند عکس)</span>
                  </label>
                  <label className={styles.fileInputLabel}>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImagesChange}
                    />
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span>{imageFiles.length > 0 ? "افزودن عکس‌های بیشتر" : "انتخاب تصاویر (چندگانه)"}</span>
                  </label>
                </div>

                {imagePreviews.length > 0 ? (
                  <div className={styles.imagePreviewsGrid}>
                    {imagePreviews.map((previewUrl, idx) => (
                      <div key={idx} className={styles.imagePreviewCard}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewUrl} alt={`Preview ${idx + 1}`} className={styles.imagePreviewThumb} />
                        <span className={idx === 0 ? styles.mainImageTag : styles.galleryImageTag}>
                          {idx === 0 ? "عکس اصلی" : `گالری ${idx}`}
                        </span>
                        <button
                          type="button"
                          className={styles.removeImageBtn}
                          onClick={() => handleRemoveImage(idx)}
                          title="حذف این عکس"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.noImagesBox}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>هیچ تصویری برای این محصول بارگذاری نشده است.</span>
                  </div>
                )}
                <p className={styles.imageHelperText}>
                  💡 تصویر اول به صورت خودکار به عنوان <strong>عکس اصلی</strong> و تصاویر بعدی به عنوان <strong>گالری تکمیلی</strong> ذخیره می‌شوند.
                </p>
              </div>

              {/* Visibility Checkbox */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "2px" }}>
                <input
                  type="checkbox"
                  id="isVisibleCheck"
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "#660000", cursor: "pointer" }}
                />
                <label
                  htmlFor="isVisibleCheck"
                  style={{ fontSize: "13px", fontWeight: 700, color: "#1a1816", cursor: "pointer" }}
                >
                  نمایش و فعال بودن این محصول در فروشگاه
                </label>
              </div>

              {/* Modal Footer */}
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
                      <span>در حال ثبت محصول...</span>
                    </>
                  ) : (
                    <span>ذخیره و ثبت نهایی محصول</span>
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
