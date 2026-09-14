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
  fetchAdminStones, 
  fetchCategories,
  createAdminCategory,
  saveAdminProduct, 
  deleteAdminProduct, 
  fetchAdminInvoices, 
  updateInvoiceStatus, 
  forceUpdateSilverPrice,
  fetchArticles,
  saveAdminArticle,
  deleteAdminArticle,
  API_BASE_URL
} from "@/lib/api";

export default function AdminDashboardPage() {
  const { token, isAdmin, loginAsAdmin, silverPricePerGramToman, fetchSilverPrice, fetchProducts, logout, setActiveReceiptInvoice } = useAppStore();

  const [activeTab, setActiveTab] = useState<"products" | "categories" | "invoices" | "articles">("products");
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [stones, setStones] = useState<BackendProduct[]>([]);
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);

  // Category State
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryMsg, setCategoryMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Direct Admin Login state
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);

  // Product Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BackendProduct | null>(null);

  // Product Form Fields
  const [name, setName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [pricingMethod, setPricingMethod] = useState<string>("METHOD_1_SILVER_MAKING_STONE");
  const [weight, setWeight] = useState<string>("4.5");
  const [makingChargePercentage, setMakingChargePercentage] = useState<string>("15");
  const [fixedPrice, setFixedPrice] = useState<string>("0");
  const [stonePrice, setStonePrice] = useState<string>("0");
  const [selectedStoneId, setSelectedStoneId] = useState<string>("");
  const [stockQuantity, setStockQuantity] = useState<string>("10");
  const [badge, setBadge] = useState<string>("NONE");
  const [isVisible, setIsVisible] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Article Modal / Form state
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleTitle, setArticleTitle] = useState("");
  const [articleSlug, setArticleSlug] = useState("");
  const [articleSummary, setArticleSummary] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleImageFile, setArticleImageFile] = useState<File | null>(null);
  const [isSavingArticle, setIsSavingArticle] = useState(false);
  const [articleFormError, setArticleFormError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [prodList, stoneList, catList, articleList] = await Promise.all([
        fetchAdminProducts(token),
        fetchAdminStones(token),
        fetchCategories(token),
        fetchArticles(token)
      ]);
      setProducts(prodList);
      setStones(stoneList);
      setCategories(catList);
      setArticles(articleList);

      if (activeTab === "invoices") {
        const invList = await fetchAdminInvoices(token);
        setInvoices(invList);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn("Failed to load admin data:", errorMsg);
      if (errorMsg.includes("403") || errorMsg.includes("401")) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, activeTab, logout]);

  useEffect(() => {
    let ignore = false;
    if (isAdmin && token) {
      const loadInitialData = async () => {
        try {
          const [prodList, stoneList, catList, articleList] = await Promise.all([
            fetchAdminProducts(token),
            fetchAdminStones(token),
            fetchCategories(token),
            fetchArticles(token)
          ]);
          if (!ignore) {
            setProducts(prodList);
            setStones(stoneList);
            setCategories(catList);
            setArticles(articleList);
          }
          if (activeTab === "invoices") {
            const invList = await fetchAdminInvoices(token);
            if (!ignore) {
              setInvoices(invList);
            }
          }
        } catch (err: unknown) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          console.warn("Failed to load admin data:", errorMsg);
          if (errorMsg.includes("403") || errorMsg.includes("401")) {
            logout();
          }
        } finally {
          if (!ignore) {
            setIsLoading(false);
          }
        }
      };
      loadInitialData();
    }
    return () => {
      ignore = true;
    };
  }, [isAdmin, token, activeTab, logout]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsCreatingCategory(true);
    setCategoryMsg(null);
    try {
      await createAdminCategory(newCategoryName.trim(), newCategoryDesc.trim() || undefined, token);
      setNewCategoryName("");
      setNewCategoryDesc("");
      setCategoryMsg({ text: "دسته‌بندی با موفقیت افزوده شد.", type: "success" });
      await loadData();
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : "خطا در افزودن دسته‌بندی";
      setCategoryMsg({ text: errorText, type: "error" });
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName("");
    setSelectedCategoryId("");
    setPricingMethod("METHOD_1_SILVER_MAKING_STONE");
    setWeight("4.5");
    setMakingChargePercentage("15");
    setFixedPrice("0");
    setStonePrice("0");
    setSelectedStoneId("");
    setStockQuantity("10");
    setBadge("NONE");
    setIsVisible(true);
    setImageFile(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: BackendProduct) => {
    setEditingProduct(prod);
    setName(prod.name || "");
    const catId = prod.categoryId 
      ? String(prod.categoryId) 
      : prod.category?.id 
      ? String(prod.category.id) 
      : "";
    setSelectedCategoryId(catId);
    setPricingMethod(prod.pricingMethod || "METHOD_1_SILVER_MAKING_STONE");
    setWeight(String(prod.weight ?? "4.5"));
    setMakingChargePercentage(String(prod.makingChargePercentage ?? "15"));
    setFixedPrice(String(prod.fixedPrice ?? "0"));
    setStonePrice(String(prod.stonePrice ?? "0"));
    setSelectedStoneId(prod.stone?.id ? String(prod.stone.id) : "");
    setStockQuantity(String(prod.stockQuantity ?? "10"));
    setBadge(prod.badge || "NONE");
    setIsVisible(prod.isVisible ?? prod.visible ?? true);
    setImageFile(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("pricingMethod", pricingMethod);
      formData.append("weight", weight || "0");
      formData.append("makingChargePercentage", makingChargePercentage || "0");
      formData.append("fixedPrice", fixedPrice || "0");
      formData.append("stonePrice", stonePrice || "0");
      formData.append("stockQuantity", stockQuantity || "0");
      formData.append("badge", badge);
      formData.append("isVisible", String(isVisible));
      formData.append("visible", String(isVisible));

      if (selectedCategoryId) {
        formData.append("categoryId", selectedCategoryId);
      }

      if (imageFile) {
        formData.append("image", imageFile);
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
      const errorText = err instanceof Error ? err.message : "خطا در ذخیره محصول";
      setFormError(errorText);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("آیا از حذف این محصول اطمینان دارید؟")) return;
    try {
      await deleteAdminProduct(id, token);
      await loadData();
      await fetchProducts();
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : "خطا در حذف محصول";
      alert(errorText);
    }
  };

  // Article Handlers
  const handleOpenAddArticleModal = () => {
    setEditingArticle(null);
    setArticleTitle("");
    setArticleSlug("");
    setArticleSummary("");
    setArticleContent("");
    setArticleImageFile(null);
    setArticleFormError(null);
    setIsArticleModalOpen(true);
  };

  const handleOpenEditArticleModal = (art: Article) => {
    setEditingArticle(art);
    setArticleTitle(art.title || "");
    setArticleSlug(art.slug || "");
    setArticleSummary(art.summary || "");
    setArticleContent(art.content || "");
    setArticleImageFile(null);
    setArticleFormError(null);
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim() || !articleContent.trim()) {
      setArticleFormError("لطفاً عنوان و متن مقاله را وارد کنید.");
      return;
    }
    setIsSavingArticle(true);
    setArticleFormError(null);

    try {
      // Auto-generate slug if empty
      const generatedSlug = articleSlug.trim() 
        ? articleSlug.trim().toLowerCase().replace(/\s+/g, "-") 
        : articleTitle.trim().toLowerCase().replace(/\s+/g, "-");

      const formData = new FormData();
      formData.append("title", articleTitle.trim());
      formData.append("slug", generatedSlug);
      formData.append("summary", articleSummary.trim());
      formData.append("content", articleContent.trim());

      if (articleImageFile) {
        formData.append("image", articleImageFile);
      }

      await saveAdminArticle(
        formData,
        !!editingArticle,
        editingArticle?.id,
        token
      );

      setIsArticleModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : "خطا در ذخیره مقاله";
      setArticleFormError(errorText);
    } finally {
      setIsSavingArticle(false);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (!confirm("آیا از حذف این مقاله اطمینان دارید؟")) return;
    try {
      await deleteAdminArticle(id, token);
      await loadData();
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : "خطا در حذف مقاله";
      alert(errorText);
    }
  };

  const handleForceUpdatePrice = async () => {
    setIsUpdatingPrice(true);
    try {
      await forceUpdateSilverPrice(token);
      await fetchSilverPrice();
      await fetchProducts();
      alert("نرخ لحظه‌ای نقره با موفقیت از TGJU بروزرسانی شد.");
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : "خطا در بروزرسانی نرخ نقره";
      alert(errorText);
    } finally {
      setIsUpdatingPrice(false);
    }
  };

  const handleChangeStatus = async (invoiceId: number, newStatus: string) => {
    try {
      await updateInvoiceStatus(invoiceId, newStatus, token);
      loadData();
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : "خطا در تغییر وضعیت فاکتور";
      alert(errorText);
    }
  };

  const handleDirectAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser.trim() || !adminPass.trim()) {
      setAdminLoginError("لطفاً نام کاربری و کلمه عبور را وارد کنید.");
      return;
    }
    setAdminLoginLoading(true);
    setAdminLoginError(null);
    try {
      await loginAsAdmin(adminUser, adminPass);
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : "نام کاربری یا کلمه عبور نادرست است.";
      setAdminLoginError(errorText);
    } finally {
      setAdminLoginLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#FAF9F5]">
        <div className="w-full max-w-md bg-white border border-[#660000]/30 rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#660000]/10 text-[#660000] flex items-center justify-center text-2xl font-bold font-serif">
              👑
            </div>
            <h1 className="text-xl font-bold text-zinc-950 font-serif">
              ورود به پنل مدیریت
            </h1>
            <p className="text-xs text-[#626667]">
              پرتال اختصاصی مدیریت محصولات، نرخ‌گذاری و فاکتورها
            </p>
          </div>

          {adminLoginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{adminLoginError}</span>
            </div>
          )}

          <form onSubmit={handleDirectAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                نام کاربری مدیر (Username)
              </label>
              <input
                type="text"
                dir="ltr"
                required
                autoComplete="username"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                placeholder="نام کاربری..."
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl text-xs focus:outline-none focus:border-[#660000] focus:ring-1 focus:ring-[#660000] text-zinc-950 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                کلمه عبور (Password)
              </label>
              <input
                type="password"
                dir="ltr"
                required
                autoComplete="current-password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl text-xs focus:outline-none focus:border-[#660000] focus:ring-1 focus:ring-[#660000] text-zinc-950 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={adminLoginLoading}
              className="w-full py-3.5 bg-[#660000] hover:bg-[#7D0000] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {adminLoginLoading ? "در حال احراز هویت..." : "ورود به پنل مدیریت"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#F4F1EA] py-10 px-4 sm:px-8 text-zinc-900">
      <div className="container mx-auto max-w-6xl space-y-8">
        
        {/* Top Bar Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white dark:bg-[#FAF9F5] border border-[#C4852B]/30 rounded-2xl shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#660000]/10 text-[#660000] text-[10px] font-bold">
                👑 ADMIN DASHBOARD
              </span>
              <span className="text-xs text-zinc-400">•</span>
              <span className="text-xs text-zinc-600 font-mono">
                نرخ زنده TGJU: {Number(silverPricePerGramToman).toLocaleString()} تومان
              </span>
            </div>
            <h1 className="text-2xl font-bold font-serif text-zinc-950 mt-1">
              مدیریت محصولات، قیمت‌گذاری، مقالات و سفارشات
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleForceUpdatePrice}
              disabled={isUpdatingPrice}
              className="px-4 py-2 bg-[#C4852B]/10 hover:bg-[#C4852B]/20 text-[#C4852B] border border-[#C4852B]/40 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{isUpdatingPrice ? "⏳" : "🔄"}</span>
              <span>{isUpdatingPrice ? "در حال دریافت..." : "بروزرسانی زنده نرخ نقره"}</span>
            </button>

            <Link
              href="/"
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-lg transition-all"
            >
              بازگشت به سایت
            </Link>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-zinc-300 gap-4 flex-wrap">
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "products"
                ? "border-[#C4852B] text-[#C4852B]"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            📦 انبار و محصولات ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "categories"
                ? "border-[#C4852B] text-[#C4852B]"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            🏷️ دسته‌بندی‌ها ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab("invoices")}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "invoices"
                ? "border-[#C4852B] text-[#C4852B]"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            🧾 فاکتورها و سفارشات ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab("articles")}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "articles"
                ? "border-[#C4852B] text-[#C4852B]"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            📝 مقالات و وبلاگ ({articles.length})
          </button>
        </div>

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs text-zinc-600">
                قیمت تمام محصولات بر اساس وزن و درصد اجرت با نرخ لحظه‌ای نقره محاسبه می‌شود.
              </p>
              <button
                onClick={handleOpenAddModal}
                className="px-5 py-2.5 bg-[#C4852B] hover:bg-[#A36C20] text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>➕</span>
                <span>افزودن محصول جدید</span>
              </button>
            </div>

            {isLoading ? (
              <div className="py-16 text-center text-xs text-zinc-500">در حال دریافت محصولات از سرور...</div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-xl border border-zinc-200">
                هیچ محصولی در پایگاه داده ثبت نشده است. با دکمه بالا اولین محصول را اضافه کنید.
              </div>
            ) : (
              <div className="bg-white dark:bg-[#FAF9F5] border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-zinc-100 text-zinc-700 font-bold border-b border-zinc-200">
                      <tr>
                        <th className="p-3.5">تصویر</th>
                        <th className="p-3.5">نام محصول</th>
                        <th className="p-3.5">روش قیمت‌گذاری</th>
                        <th className="p-3.5">وزن (گرم)</th>
                        <th className="p-3.5">اجرت (%)</th>
                        <th className="p-3.5">موجودی</th>
                        <th className="p-3.5">قیمت زنده (تومان)</th>
                        <th className="p-3.5 text-center">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {products.map((p) => {
                        const img = p.imageUrl 
                          ? (p.imageUrl.startsWith("http") ? p.imageUrl : `${API_BASE_URL}${p.imageUrl}`)
                          : null;
                        return (
                          <tr key={p.id} className="hover:bg-zinc-50/80 transition-colors">
                            <td className="p-3.5">
                              {img ? (
                                <img src={img} alt={p.name} className="w-12 h-12 object-cover rounded-lg border border-zinc-200" />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 text-xs">
                                  بدون عکس
                                </div>
                              )}
                            </td>
                            <td className="p-3.5 font-bold text-zinc-900">
                              {p.name}
                              {p.badge && p.badge !== "NONE" && (
                                <span className="mr-2 px-2 py-0.5 rounded-full bg-[#660000]/10 text-[#660000] text-[9px] font-bold">
                                  {p.badge}
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 font-mono text-[11px] text-zinc-600">
                              {p.pricingMethod === "METHOD_1_SILVER_MAKING_STONE" && "نقره + اجرت + نگین"}
                              {p.pricingMethod === "METHOD_2_SILVER_MAKING" && "نقره + اجرت"}
                              {p.pricingMethod === "METHOD_3_FIXED_PRICE" && "قیمت ثابت"}
                              {p.pricingMethod === "METHOD_4_STONE_ONLY" && "سنگ مستقل"}
                              {!p.pricingMethod && "استاندارد"}
                            </td>
                            <td className="p-3.5 font-mono">{p.weight ? `${p.weight} گرم` : "—"}</td>
                            <td className="p-3.5 font-mono">{p.makingChargePercentage ? `${p.makingChargePercentage}%` : "—"}</td>
                            <td className="p-3.5 font-mono">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                (p.stockQuantity ?? 0) > 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                              }`}>
                                {p.stockQuantity ?? 0} عدد
                              </span>
                            </td>
                            <td className="p-3.5 font-mono font-bold text-[#C4852B]">
                              {Number(p.livePriceToman || 0).toLocaleString()} تومان
                            </td>
                            <td className="p-3.5 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleOpenEditModal(p)}
                                  className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded text-[11px] transition-colors cursor-pointer"
                                >
                                  ویرایش
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded text-[11px] transition-colors cursor-pointer"
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
              </div>
            )}
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="p-6 bg-white dark:bg-[#FAF9F5] border border-zinc-200 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-zinc-950">
                افزودن دسته‌بندی جدید (Category Management)
              </h3>
              <p className="text-xs text-zinc-600">
                دسته‌بندی‌های جدید به عنوان فیلتر در صفحه محصولات و اختصاص به زیورآلات قابل استفاده خواهند بود.
              </p>

              {categoryMsg && (
                <div className={`p-3 text-xs rounded-xl ${
                  categoryMsg.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"
                }`}>
                  {categoryMsg.text}
                </div>
              )}

              <form onSubmit={handleCreateCategory} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="نام دسته‌بندی (مانند: پابند، نیم‌ست، سینه ریز...)"
                    className="px-4 py-2.5 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-xl text-xs text-zinc-950 focus:outline-none focus:border-[#C4852B]"
                  />
                  <input
                    type="text"
                    value={newCategoryDesc}
                    onChange={(e) => setNewCategoryDesc(e.target.value)}
                    placeholder="توضیح کوتاه دسته‌بندی (اختیاری)"
                    className="px-4 py-2.5 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-xl text-xs text-zinc-950 focus:outline-none focus:border-[#C4852B]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCreatingCategory}
                  className="px-6 py-2.5 bg-[#C4852B] hover:bg-[#A36C20] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isCreatingCategory ? "در حال ثبت..." : "افزودن دسته‌بندی"}
                </button>
              </form>
            </div>

            <div className="bg-white dark:bg-[#FAF9F5] border border-zinc-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
              <h3 className="text-sm font-bold text-zinc-950">
                دسته‌بندی‌های فعال سیستم ({categories.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-4 bg-zinc-50 dark:bg-[#F4F1EA] rounded-xl border border-zinc-200 flex flex-col justify-between gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900">{cat.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#C4852B]/10 text-[#C4852B] text-[10px] font-bold">
                        شناسه: {cat.id}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-[11px] text-zinc-500 leading-relaxed">{cat.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INVOICES TAB */}
        {activeTab === "invoices" && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="py-16 text-center text-xs text-zinc-500">در حال بارگذاری فاکتورها...</div>
            ) : invoices.length === 0 ? (
              <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-xl border border-zinc-200">
                هیچ فاکتوری هنوز ثبت نشده است.
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((inv) => {
                  const isPaid = inv.paid ?? inv.isPaid ?? false;
                  return (
                    <div key={inv.id} className="p-6 bg-white dark:bg-[#FAF9F5] border border-zinc-200 rounded-2xl shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-zinc-200 gap-2">
                        <div>
                          <span className="text-base font-bold text-zinc-950 font-serif">
                            فاکتور شماره #{inv.id}
                          </span>
                          <span className="text-xs text-zinc-500 font-mono mr-3">
                            مشتری: {inv.user?.firstName ? `${inv.user.firstName} ${inv.user.lastName || ""}` : inv.user?.phoneNumber} ({inv.user?.phoneNumber})
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveReceiptInvoice(inv)}
                            className="px-3 py-1.5 bg-[#C4852B] hover:bg-[#A76E1F] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <span>🧾</span>
                            <span>رسید رسمی</span>
                          </button>

                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            isPaid ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {isPaid ? "پرداخت شده" : "در انتظار پرداخت"}
                          </span>
                          <select
                            value={inv.orderStatus || "PROCESSING"}
                            onChange={(e) => handleChangeStatus(inv.id, e.target.value)}
                            className="px-2.5 py-1 bg-zinc-100 border border-zinc-300 rounded-lg text-xs font-bold cursor-pointer"
                          >
                            <option value="PROCESSING">در حال پردازش (PROCESSING)</option>
                            <option value="DELIVERED">تحویل شده (DELIVERED)</option>
                            <option value="CANCELLED">لغو شده (CANCELLED)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="font-bold text-zinc-700 block mb-1">اقلام فاکتور:</span>
                          <div className="space-y-1 bg-zinc-50 dark:bg-[#F4F1EA] p-3 rounded-lg">
                            {inv.items?.map((it) => (
                              <div key={it.id} className="flex justify-between">
                                <span>{it.product?.name} × {it.quantity}</span>
                                <span className="font-mono">{Number(it.calculatedPriceToman).toLocaleString()} تومان</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5 bg-zinc-50 dark:bg-[#F4F1EA] p-3 rounded-lg text-zinc-700">
                          <div><span className="font-bold">نشانی تحویل:</span> {inv.shippingAddress}</div>
                          <div><span className="font-bold">کد پستی:</span> <span className="font-mono">{inv.postalCode}</span></div>
                          <div className="pt-2 border-t border-zinc-200 flex justify-between font-bold text-sm text-[#C4852B]">
                            <span>مبلغ کل:</span>
                            <span className="font-mono">{Number(inv.finalTotalToman).toLocaleString()} تومان</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ARTICLES TAB */}
        {activeTab === "articles" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs text-zinc-600">
                مدیریت مقالات، راهنماهای نگهداری، آموزش‌ها و بلاگ رسمی برند.
              </p>
              <button
                onClick={handleOpenAddArticleModal}
                className="px-5 py-2.5 bg-[#C4852B] hover:bg-[#A36C20] text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>➕</span>
                <span>افزودن مقاله جدید</span>
              </button>
            </div>

            {isLoading ? (
              <div className="py-16 text-center text-xs text-zinc-500">در حال دریافت مقالات...</div>
            ) : articles.length === 0 ? (
              <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-xl border border-zinc-200">
                هنوز هیچ مقاله‌ای ثبت نشده است. با دکمه بالا اولین مقاله را بنویسید.
              </div>
            ) : (
              <div className="bg-white dark:bg-[#FAF9F5] border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-zinc-100 text-zinc-700 font-bold border-b border-zinc-200">
                      <tr>
                        <th className="p-3.5">تصویر</th>
                        <th className="p-3.5">عنوان مقاله</th>
                        <th className="p-3.5">نامک (Slug)</th>
                        <th className="p-3.5">خلاصه</th>
                        <th className="p-3.5">تاریخ ثبت</th>
                        <th className="p-3.5 text-center">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {articles.map((art) => {
                        const img = art.imageUrl
                          ? (art.imageUrl.startsWith("http") ? art.imageUrl : `${API_BASE_URL}${art.imageUrl}`)
                          : null;
                        return (
                          <tr key={art.id} className="hover:bg-zinc-50/80 transition-colors">
                            <td className="p-3.5">
                              {img ? (
                                <img src={img} alt={art.title} className="w-12 h-12 object-cover rounded-lg border border-zinc-200" />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 text-xs">
                                  بدون عکس
                                </div>
                              )}
                            </td>
                            <td className="p-3.5 font-bold text-zinc-900 max-w-xs">
                              {art.title}
                            </td>
                            <td className="p-3.5 font-mono text-[11px] text-zinc-600">
                              {art.slug}
                            </td>
                            <td className="p-3.5 text-zinc-500 max-w-sm truncate">
                              {art.summary}
                            </td>
                            <td className="p-3.5 font-mono text-zinc-500 text-[11px]">
                              {art.createdAt ? new Date(art.createdAt).toLocaleDateString("fa-IR") : "—"}
                            </td>
                            <td className="p-3.5 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Link
                                  href={`/articles/${art.slug}`}
                                  target="_blank"
                                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded text-[11px] transition-colors"
                                >
                                  مشاهده
                                </Link>
                                <button
                                  onClick={() => handleOpenEditArticleModal(art)}
                                  className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded text-[11px] transition-colors cursor-pointer"
                                >
                                  ویرایش
                                </button>
                                <button
                                  onClick={() => handleDeleteArticle(art.id)}
                                  className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded text-[11px] transition-colors cursor-pointer"
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
              </div>
            )}
          </div>
        )}

        {/* ADD / EDIT PRODUCT MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#FAF9F5] border border-[#C4852B]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8">
              
              <div className="flex justify-between items-center pb-4 border-b border-zinc-200">
                <h3 className="text-lg font-bold font-serif text-zinc-900">
                  {editingProduct ? "ویرایش محصول" : "افزودن محصول نقره جدید"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">✕</button>
              </div>

              {formError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSaveProduct} className="mt-4 space-y-4 overflow-y-auto flex-1 pr-1">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">نام محصول *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: انگشتر نقره دست‌ساز با سنگ فیروزه"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">دسته‌بندی (Category)</label>
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900"
                    >
                      <option value="">-- بدون دسته‌بندی --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} (شناسه: {cat.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">نشان ویژه (Badge)</label>
                    <select
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900"
                    >
                      <option value="NONE">عادی (بدون نشان)</option>
                      <option value="SPECIAL_OFFER">پیشنهاد ویژه (SPECIAL_OFFER)</option>
                      <option value="BEST_SELLER">پرفروش‌ترین (BEST_SELLER)</option>
                      <option value="NEW_ARRIVAL">جدید (NEW_ARRIVAL)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">روش قیمت‌گذاری</label>
                  <select
                    value={pricingMethod}
                    onChange={(e) => setPricingMethod(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900"
                  >
                    <option value="METHOD_1_SILVER_MAKING_STONE">روش ۱: نقره + اجرت + نگین متصل</option>
                    <option value="METHOD_2_SILVER_MAKING">روش ۲: نقره + اجرت (بدون نگین)</option>
                    <option value="METHOD_3_FIXED_PRICE">روش ۳: قیمت ثابت</option>
                    <option value="METHOD_4_STONE_ONLY">روش ۴: سنگ / نگین مستقل</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">وزن نقره (گرم)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">درصد اجرت ساخت (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={makingChargePercentage}
                      onChange={(e) => setMakingChargePercentage(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">موجودی انبار</label>
                    <input
                      type="number"
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                {pricingMethod === "METHOD_1_SILVER_MAKING_STONE" && (
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">انتخاب سنگ/نگین متصل</label>
                    <select
                      value={selectedStoneId}
                      onChange={(e) => setSelectedStoneId(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900"
                    >
                      <option value="">-- بدون سنگ متصل --</option>
                      {stones.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name} (قیمت: {Number(st.fixedPrice || st.stonePrice || 0).toLocaleString()} تومان)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {pricingMethod === "METHOD_3_FIXED_PRICE" && (
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">قیمت ثابت (تومان)</label>
                    <input
                      type="number"
                      value={fixedPrice}
                      onChange={(e) => setFixedPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">تصویر محصول (آپلود فایل)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-xs text-zinc-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#C4852B]/10 file:text-[#C4852B] hover:file:bg-[#C4852B]/20"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="visibleCheck"
                    checked={isVisible}
                    onChange={(e) => setIsVisible(e.target.checked)}
                    className="rounded border-zinc-300 text-[#C4852B] focus:ring-[#C4852B]"
                  />
                  <label htmlFor="visibleCheck" className="text-xs text-zinc-700 font-medium cursor-pointer">
                    نمایش در فروشگاه عمومی (Visible to customers)
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-lg"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-[#C4852B] hover:bg-[#A36C20] text-white text-xs font-bold rounded-lg shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? "در حال ذخیره..." : "ذخیره محصول"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ADD / EDIT ARTICLE MODAL */}
        {isArticleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#FAF9F5] border border-[#C4852B]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8">
              
              <div className="flex justify-between items-center pb-4 border-b border-zinc-200">
                <h3 className="text-lg font-bold font-serif text-zinc-900">
                  {editingArticle ? "ویرایش مقاله" : "افزودن مقاله جدید"}
                </h3>
                <button onClick={() => setIsArticleModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">✕</button>
              </div>

              {articleFormError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                  {articleFormError}
                </div>
              )}

              <form onSubmit={handleSaveArticle} className="mt-4 space-y-4 overflow-y-auto flex-1 pr-1">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">عنوان مقاله *</label>
                  <input
                    type="text"
                    required
                    value={articleTitle}
                    onChange={(e) => {
                      setArticleTitle(e.target.value);
                      if (!editingArticle && !articleSlug) {
                        setArticleSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                      }
                    }}
                    placeholder="مثال: راهنمای نگهداری و تمیز کردن زیورآلات نقره"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">نامک آدرس (Slug) *</label>
                  <input
                    type="text"
                    dir="ltr"
                    required
                    value={articleSlug}
                    onChange={(e) => setArticleSlug(e.target.value)}
                    placeholder="silver-jewelry-care-guide"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-lg text-xs font-mono text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">خلاصه کوتاه (Summary)</label>
                  <textarea
                    rows={2}
                    value={articleSummary}
                    onChange={(e) => setArticleSummary(e.target.value)}
                    placeholder="چکیده کوتاه از محتوای مقاله برای نمایش در کارت‌ها..."
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">متن کامل مقاله (Content) *</label>
                  <textarea
                    rows={8}
                    required
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    placeholder="متن کامل مقاله (پشتیبانی از سرفصل با ### و لیست با - )..."
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 font-sans leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">تصویر کاور مقاله (اختیاری)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setArticleImageFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-xs text-zinc-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#C4852B]/10 file:text-[#C4852B] hover:file:bg-[#C4852B]/20"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setIsArticleModalOpen(false)}
                    className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-lg"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingArticle}
                    className="px-6 py-2 bg-[#C4852B] hover:bg-[#A36C20] text-white text-xs font-bold rounded-lg shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSavingArticle ? "در حال ذخیره..." : "ذخیره مقاله"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
