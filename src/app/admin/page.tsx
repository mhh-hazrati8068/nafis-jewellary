"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { 
  BackendProduct, 
  BackendCategory,
  Invoice, 
  fetchAdminProducts, 
  fetchAdminStones, 
  fetchCategories,
  createAdminCategory,
  saveAdminProduct, 
  deleteAdminProduct, 
  fetchAdminInvoices, 
  updateInvoiceStatus, 
  forceUpdateSilverPrice,
  API_BASE_URL
} from "@/lib/api";

export default function AdminDashboardPage() {
  const { token, isAdmin, loginAsAdmin, silverPricePerGramToman, fetchSilverPrice, fetchProducts, logout } = useAppStore();

  const [activeTab, setActiveTab] = useState<"products" | "invoices" | "categories">("products");
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [stones, setStones] = useState<BackendProduct[]>([]);
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);

  // New Category State
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryMsg, setCategoryMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Direct Admin Login state
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BackendProduct | null>(null);

  // Form Fields
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

  const loadData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [prodList, stoneList, catList] = await Promise.all([
        fetchAdminProducts(token),
        fetchAdminStones(token),
        fetchCategories(token)
      ]);
      setProducts(prodList);
      setStones(stoneList);
      setCategories(catList);

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
          const [prodList, stoneList, catList] = await Promise.all([
            fetchAdminProducts(token),
            fetchAdminStones(token),
            fetchCategories(token)
          ]);
          if (!ignore) {
            setProducts(prodList);
            setStones(stoneList);
            setCategories(catList);
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
      await createAdminCategory(newCategoryName.trim(), token);
      setNewCategoryName("");
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
    setSelectedCategoryId(prod.categoryId ? String(prod.categoryId) : "");
    setPricingMethod(prod.pricingMethod || "METHOD_1_SILVER_MAKING_STONE");
    setWeight(prod.weight ? String(prod.weight) : "4.5");
    setMakingChargePercentage(prod.makingChargePercentage ? String(prod.makingChargePercentage) : "15");
    setFixedPrice(prod.fixedPrice ? String(prod.fixedPrice) : "0");
    setStonePrice(prod.stonePrice ? String(prod.stonePrice) : "0");
    setSelectedStoneId(prod.stone?.id ? String(prod.stone.id) : "");
    setStockQuantity(String(prod.stockQuantity || 10));
    setBadge(prod.badge || "NONE");
    setIsVisible(prod.isVisible ?? true);
    setImageFile(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("نام محصول الزامی است");
      return;
    }

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
              مدیریت محصولات، قیمت‌گذاری و سفارشات
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
        <div className="flex border-b border-zinc-300 gap-4">
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
              <div className="py-16 text-center text-xs text-zinc-500">در حال بارگذاری اطلاعات محصولات...</div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center text-xs text-zinc-500 bg-white rounded-xl border border-zinc-200">
                محصولی در پایگاه‌داده وجود ندارد. با کلیک بر روی «افزودن محصول جدید» اولین کالای خود را اضافه کنید.
              </div>
            ) : (
              <div className="bg-white dark:bg-[#FAF9F5] border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-zinc-50 dark:bg-[#F4F1EA] text-zinc-600 border-b border-zinc-200">
                      <tr>
                        <th className="py-3 px-4">تصویر</th>
                        <th className="py-3 px-4">نام محصول</th>
                        <th className="py-3 px-4">دسته‌بندی</th>
                        <th className="py-3 px-4">روش قیمت‌گذاری</th>
                        <th className="py-3 px-4">وزن (گرم)</th>
                        <th className="py-3 px-4">اجرت (%)</th>
                        <th className="py-3 px-4">نگین متصل</th>
                        <th className="py-3 px-4">موجودی</th>
                        <th className="py-3 px-4">نشان (Badge)</th>
                        <th className="py-3 px-4 text-center">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {products.map((p) => {
                        const imgUrl = p.imageUrl 
                          ? (p.imageUrl.startsWith("http") ? p.imageUrl : `${API_BASE_URL}${p.imageUrl}`)
                          : null;
                        const catLabel = p.categoryName || categories.find(c => c.id === p.categoryId)?.name || "-";
                        return (
                          <tr key={p.id} className="hover:bg-zinc-50/80 transition-colors">
                            <td className="py-3 px-4">
                              {imgUrl ? (
                                <img src={imgUrl} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-zinc-100" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-zinc-200 flex items-center justify-center text-xs">💍</div>
                              )}
                            </td>
                            <td className="py-3 px-4 font-bold text-zinc-900">{p.name}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-md bg-[#C4852B]/10 text-[#C4852B] text-[11px] font-semibold">
                                {catLabel}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-zinc-600">{p.pricingMethod}</td>
                            <td className="py-3 px-4 font-mono">{p.weight || 0}</td>
                            <td className="py-3 px-4 font-mono">{p.makingChargePercentage || 0}%</td>
                            <td className="py-3 px-4 text-zinc-600">{p.stone?.name || "-"}</td>
                            <td className="py-3 px-4 font-mono font-bold text-[#C4852B]">{p.stockQuantity}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[10px] font-mono">
                                {p.badge || "NONE"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center space-x-2 rtl:space-x-reverse">
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded font-semibold text-[11px] transition-colors cursor-pointer"
                              >
                                ویرایش
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded font-semibold text-[11px] transition-colors cursor-pointer"
                              >
                                حذف
                              </button>
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
              <h2 className="text-base font-bold text-zinc-950 font-serif">
                ➕ ایجاد دسته‌بندی جدید (POST /api/admin/categories)
              </h2>
              <p className="text-xs text-zinc-600">
                دسته‌بندی‌های جدید به کاربران امکان فیلتر هوشمند محصولات بر اساس رسته کالایی را می‌دهند.
              </p>

              {categoryMsg && (
                <div className={`p-3 text-xs rounded-xl ${
                  categoryMsg.type === "success" 
                    ? "bg-green-50 text-green-800 border border-green-200" 
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}>
                  {categoryMsg.text}
                </div>
              )}

              <form onSubmit={handleCreateCategory} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="نام دسته‌بندی جدید (مانند: پابند، نیم‌ست، سینه ریز...)"
                  className="flex-1 px-4 py-2.5 bg-zinc-50 dark:bg-white border border-zinc-300 rounded-xl text-xs text-zinc-950 focus:outline-none focus:border-[#C4852B]"
                />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-4 bg-zinc-50 dark:bg-[#F4F1EA] rounded-xl border border-zinc-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-zinc-900 block">{cat.name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">شناسه: {cat.id}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#C4852B]/10 text-[#C4852B] text-[10px] font-bold">
                      فعال
                    </span>
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
                {invoices.map((inv) => (
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
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          inv.isPaid ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {inv.isPaid ? "پرداخت شده" : "در انتظار پرداخت"}
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
                          <span>مبلغ کل (با ۱۰٪ مالیات):</span>
                          <span className="font-mono">{Number(inv.finalTotalToman).toLocaleString()} تومان</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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

      </div>
    </div>
  );
}
