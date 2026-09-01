"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { 
  BackendProduct, 
  Invoice, 
  fetchAdminProducts, 
  fetchAdminStones, 
  saveAdminProduct, 
  deleteAdminProduct, 
  fetchAdminInvoices, 
  updateInvoiceStatus, 
  forceUpdateSilverPrice,
  API_BASE_URL
} from "@/lib/api";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { token, isAdmin, setAuthModalOpen, silverPricePerGramToman, fetchSilverPrice, fetchProducts, logout } = useAppStore();

  const [activeTab, setActiveTab] = useState<"products" | "invoices">("products");
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [stones, setStones] = useState<BackendProduct[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BackendProduct | null>(null);

  // Form Fields
  const [name, setName] = useState("");
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

  useEffect(() => {
    if (isAdmin && token) {
      loadData();
    }
  }, [isAdmin, token, activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "products") {
        const [prodList, stoneList] = await Promise.all([
          fetchAdminProducts(token),
          fetchAdminStones(token)
        ]);
        setProducts(prodList);
        setStones(stoneList);
      } else {
        const invList = await fetchAdminInvoices(token);
        setInvoices(invList);
      }
    } catch (err: any) {
      console.warn("Failed to load admin data:", err?.message);
      if (err?.message?.includes("403") || err?.message?.includes("401")) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName("");
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
    setPricingMethod(prod.pricingMethod || "METHOD_1_SILVER_MAKING_STONE");
    setWeight(prod.weight ? String(prod.weight) : "0");
    setMakingChargePercentage(prod.makingChargePercentage ? String(prod.makingChargePercentage) : "0");
    setFixedPrice(prod.fixedPrice ? String(prod.fixedPrice) : "0");
    setStonePrice(prod.stonePrice ? String(prod.stonePrice) : "0");
    setSelectedStoneId(prod.stone?.id ? String(prod.stone.id) : "");
    setStockQuantity(String(prod.stockQuantity || 0));
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

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const stoneIdNumber = selectedStoneId ? Number(selectedStoneId) : undefined;
      await saveAdminProduct(
        formData, 
        !!editingProduct, 
        editingProduct?.id, 
        stoneIdNumber, 
        token
      );

      setIsModalOpen(false);
      await loadData();
      await fetchProducts();
    } catch (err: any) {
      setFormError(err.message || "خطا در ذخیره محصول");
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
    } catch (err: any) {
      alert(err.message || "خطا در حذف محصول");
    }
  };

  const handleForceUpdatePrice = async () => {
    setIsUpdatingPrice(true);
    try {
      await forceUpdateSilverPrice(token);
      await fetchSilverPrice();
      await fetchProducts();
      alert("نرخ لحظه‌ای نقره با موفقیت از TGJU بروزرسانی شد.");
    } catch (err: any) {
      alert(err.message || "خطا در بروزرسانی نرخ نقره");
    } finally {
      setIsUpdatingPrice(false);
    }
  };

  const handleChangeStatus = async (invoiceId: number, newStatus: string) => {
    try {
      await updateInvoiceStatus(invoiceId, newStatus, token);
      loadData();
    } catch (err: any) {
      alert(err.message || "خطا در تغییر وضعیت فاکتور");
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <div className="p-8 bg-white dark:bg-[#FAF9F5] border border-[#660000]/30 rounded-2xl shadow-xl space-y-4">
          <span className="text-5xl block">🔒</span>
          <h1 className="text-xl font-bold text-zinc-900 font-serif">پنل مدیریت زیورآلات نفیسه عبادی</h1>
          <p className="text-xs text-zinc-600">
            برای دسترسی به این بخش، لطفاً با نام کاربری و کلمه عبور ادمین وارد شوید.
          </p>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-6 py-2.5 bg-[#660000] hover:bg-[#800000] text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-md transition-all cursor-pointer"
          >
            ورود به عنوان ادمین (admin / admin)
          </button>
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
