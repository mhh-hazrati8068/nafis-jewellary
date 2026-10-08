import { create } from 'zustand'
import { Language, translations } from '@/lib/translations'
import { Product, initialProducts } from '@/data/products'
import { translateDynamicText } from '@/lib/dynamicTranslator'
import { 
  UserProfile, 
  fetchAllProducts, 
  fetchLiveSilverPrice as getLiveSilverPriceApi,
  verifyOtp,
  adminLogin as adminLoginApi,
  getUserProfile,
  API_BASE_URL,
  BackendProduct,
  BackendCategory,
  fetchCategories as fetchCategoriesApi,
  getCachedApiData
} from '@/lib/api'

export type { Product }

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  category?: string
  material?: string
}

interface AppState {
  // Language & Direction state
  language: Language
  direction: 'rtl' | 'ltr'
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: typeof translations['fa']

  // Categories state
  categories: BackendCategory[]
  selectedCategoryId: number | null
  setSelectedCategoryId: (catId: number | null) => void
  fetchCategories: () => Promise<void>

  // Products state
  products: Product[]
  backendProducts: BackendProduct[]
  isLoadingProducts: boolean
  getProductById: (id: number) => Product | undefined
  fetchProducts: (categoryId?: number | null) => Promise<void>

  // Search modal state
  isSearchOpen: boolean
  toggleSearch: (isOpen?: boolean) => void

  // Cart state
  cart: CartItem[]
  isCartOpen: boolean
  addToCart: (product: { id: number; name: string; price: number; image: string; category?: string; material?: string }) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, delta: number) => void
  toggleCart: (isOpen?: boolean) => void
  clearCart: () => void

  // Wishlist state
  wishlist: number[]
  toggleWishlist: (id: number) => void

  // Live Silver & Gold Price Ticker
  silverPricePerGramToman: number
  goldPricePerGram: number
  fetchSilverPrice: () => Promise<void>

  // Authentication state
  token: string | null
  user: UserProfile | null
  isAdmin: boolean
  isAuthModalOpen: boolean
  isProfileModalOpen: boolean
  activeReceiptInvoice: import('@/lib/api').Invoice | null
  setAuthModalOpen: (open: boolean) => void
  setProfileModalOpen: (open: boolean) => void
  setActiveReceiptInvoice: (invoice: import('@/lib/api').Invoice | null) => void
  loginWithOtp: (phoneNumber: string, code: string) => Promise<void>
  loginAsAdmin: (username: string, pass: string) => Promise<void>
  logout: () => void
  loadUserFromStorage: () => Promise<void>
  refreshProfile: () => Promise<void>
}

function inferCategorySlug(name: string, categoryName?: string, categoryId?: number): 'rings' | 'necklaces' | 'bracelets' | 'earrings' {
  const combined = `${name} ${categoryName || ''}`.toLowerCase();
  if (categoryId === 1 || combined.includes('دستبند') || combined.includes('bracelet')) return 'bracelets';
  if (categoryId === 2 || combined.includes('انگشتر') || combined.includes('ring') || combined.includes('حلقه')) return 'rings';
  if (categoryId === 3 || combined.includes('گردنبند') || combined.includes('آویز') || combined.includes('necklace') || combined.includes('pendant')) return 'necklaces';
  if (categoryId === 4 || combined.includes('گوشواره') || combined.includes('earring')) return 'earrings';
  return 'rings';
}

// Convert Backend product to Frontend product with automatic localization
function mapBackendToFrontend(bp: BackendProduct): Product {
  const imageUrl = bp.imageUrl 
    ? (bp.imageUrl.startsWith('http') ? bp.imageUrl : `${API_BASE_URL}${bp.imageUrl}`)
    : "https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=800&auto=format&fit=crop";

  const stoneEn = bp.stoneName ? translateDynamicText(bp.stoneName, 'en') : '';
  const stoneAr = bp.stoneName ? translateDynamicText(bp.stoneName, 'ar') : '';
  const effectiveCatId = bp.categoryId ?? bp.category?.id;
  const effectiveCatName = bp.categoryName || bp.category?.name;
  const catSlug = inferCategorySlug(bp.name, effectiveCatName, effectiveCatId);

  const galleryUrls = (bp.galleryImages || [])
    .filter(Boolean)
    .map((img) => (img.startsWith('http') ? img : `${API_BASE_URL}${img}`));
  const allImages = [imageUrl, ...galleryUrls.filter((u) => u !== imageUrl)];

  return {
    id: bp.id,
    nameFa: bp.name,
    nameEn: translateDynamicText(bp.name, 'en'),
    nameAr: translateDynamicText(bp.name, 'ar'),
    price: bp.livePriceToman || 0,
    category: catSlug,
    categoryId: effectiveCatId,
    categoryFa: effectiveCatName || (catSlug === 'rings' ? 'انگشتر' : catSlug === 'necklaces' ? 'گردنبند' : catSlug === 'bracelets' ? 'دستبند' : 'گوشواره'),
    categoryEn: translateDynamicText(effectiveCatName || catSlug, 'en'),
    categoryAr: translateDynamicText(effectiveCatName || catSlug, 'ar'),
    materialFa: `نقره ۹۲۵ عیار خالص ${bp.weight ? `(${bp.weight} گرم)` : ''}`,
    materialEn: `Certified 925 Sterling Silver ${bp.weight ? `(${bp.weight}g)` : ''}`,
    materialAr: `فضة نقية استرليني عيار 925 ${bp.weight ? `(${bp.weight} جرام)` : ''}`,
    descriptionFa: `طراحی اصیل نقره با فرمول قیمت‌گذاری پویا بر پایه نرخ لحظه‌ای TGJU. موجودی: ${bp.stockQuantity} عدد`,
    descriptionEn: `Authentic fine silver with dynamic TGJU live pricing. In stock: ${bp.stockQuantity} pcs`,
    descriptionAr: `فضة نقية أصيلة مع تسعير مباشر وفق أسعار السوق الحية. المتوفر: ${bp.stockQuantity} قطع`,
    image: imageUrl,
    images: allImages.length > 0 ? allImages : [imageUrl],
    weightGram: bp.weight || 4.2,
    carat: "Silver 925",
    featured: bp.badge === 'BEST_SELLER' || bp.badge === 'SPECIAL_OFFER',
  };
}

export const useAppStore = create<AppState>()((set, get) => ({
  // Language & Direction
  language: 'fa',
  direction: 'rtl',
  t: translations['fa'],

  setLanguage: (lang) => {
    const dir = lang === 'en' ? 'ltr' : 'rtl'
    if (typeof window !== 'undefined') {
      localStorage.setItem('nafis_language', lang);
      document.documentElement.dir = dir
      document.documentElement.lang = lang
    }
    set({
      language: lang,
      direction: dir,
      t: translations[lang]
    })
  },

  toggleLanguage: () => {
    const current = get().language
    const nextLang: Language = current === 'fa' ? 'en' : current === 'en' ? 'ar' : 'fa'
    get().setLanguage(nextLang)
  },

  // Categories
  categories: [
    { id: 1, name: "دستبند" },
    { id: 2, name: "انگشتر" },
    { id: 3, name: "گردنبند" },
    { id: 4, name: "گوشواره" }
  ],
  selectedCategoryId: null,
  setSelectedCategoryId: (catId) => {
    set({ selectedCategoryId: catId });

    // 1. Instant optimistic local filtering (0ms feedback)
    const { backendProducts } = get();
    if (backendProducts && backendProducts.length > 0) {
      const filtered = catId 
        ? backendProducts.filter((p) => p.categoryId === catId || p.category?.id === catId)
        : backendProducts;
      if (filtered.length > 0) {
        set({ products: filtered.map(mapBackendToFrontend) });
      }
    } else {
      // Fallback filter from initial products
      if (catId) {
        const filtered = initialProducts.filter(p => {
          if (p.categoryId === catId) return true;
          if (catId === 1 && p.category === 'bracelets') return true;
          if (catId === 2 && p.category === 'rings') return true;
          if (catId === 3 && p.category === 'necklaces') return true;
          if (catId === 4 && p.category === 'earrings') return true;
          return false;
        });
        if (filtered.length > 0) {
          set({ products: filtered });
        }
      } else {
        set({ products: initialProducts });
      }
    }

    // 2. Background server fetch and cache update
    get().fetchProducts(catId);
  },
  fetchCategories: async () => {
    try {
      const { token } = get();
      const cats = await fetchCategoriesApi(token);
      if (cats && cats.length > 0) {
        set({ categories: cats });
      }
    } catch (err) {
      console.warn('Could not load categories:', err);
    }
  },

  // Products
  products: initialProducts,
  backendProducts: [],
  isLoadingProducts: false,
  getProductById: (id) => get().products.find((p) => p.id === id),

  fetchProducts: async (categoryId?: number | null) => {
    const targetCatId = categoryId !== undefined ? categoryId : get().selectedCategoryId;

    // Only set loading if current product list is completely empty
    if (!get().products || get().products.length === 0) {
      set({ isLoadingProducts: true });
    }

    try {
      const { token } = get();
      const backendItems = await fetchAllProducts(targetCatId, token);
      if (backendItems && backendItems.length > 0) {
        const mapped = backendItems.map(mapBackendToFrontend);
        set({
          products: mapped,
          backendProducts: targetCatId ? get().backendProducts : backendItems,
          isLoadingProducts: false,
        });
      } else {
        // Fallback filter if backend returns empty for category
        if (targetCatId) {
          const filtered = initialProducts.filter(p => {
            if (p.categoryId === targetCatId) return true;
            if (targetCatId === 1 && p.category === 'bracelets') return true;
            if (targetCatId === 2 && p.category === 'rings') return true;
            if (targetCatId === 3 && p.category === 'necklaces') return true;
            if (targetCatId === 4 && p.category === 'earrings') return true;
            return false;
          });
          set({ products: filtered.length > 0 ? filtered : initialProducts, isLoadingProducts: false });
        } else {
          set({ products: initialProducts, isLoadingProducts: false });
        }
      }
    } catch {
      set({ products: initialProducts, isLoadingProducts: false });
    }
  },

  // Search Modal
  isSearchOpen: false,
  toggleSearch: (isOpen) => set((state) => ({
    isSearchOpen: isOpen !== undefined ? isOpen : !state.isSearchOpen
  })),

  // Cart State
  cart: [],
  isCartOpen: false,
  silverPricePerGramToman: 474820,
  goldPricePerGram: 85.50,

  fetchSilverPrice: async () => {
    const { token } = get();
    const price = await getLiveSilverPriceApi(token);
    if (price && price > 0) {
      set({ silverPricePerGramToman: price });
    }
  },

  addToCart: (product) => set((state) => {
    const existingIndex = state.cart.findIndex((item) => item.id === product.id)
    if (existingIndex > -1) {
      const updatedCart = [...state.cart]
      updatedCart[existingIndex].quantity += 1
      return { cart: updatedCart, isCartOpen: true }
    }
    return {
      cart: [...state.cart, { ...product, quantity: 1 }],
      isCartOpen: true
    }
  }),

  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== id)
  })),

  updateQuantity: (id, delta) => set((state) => {
    const updatedCart = state.cart
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta
          return newQty > 0 ? { ...item, quantity: newQty } : null
        }
        return item
      })
      .filter(Boolean) as CartItem[]

    return { cart: updatedCart }
  }),

  toggleCart: (isOpen) => set((state) => ({
    isCartOpen: isOpen !== undefined ? isOpen : !state.isCartOpen
  })),

  clearCart: () => set({ cart: [] }),

  wishlist: [1, 2],
  toggleWishlist: (id) => set((state) => {
    const exists = state.wishlist.includes(id)
    return {
      wishlist: exists
        ? state.wishlist.filter((wId) => wId !== id)
        : [...state.wishlist, id]
    }
  }),

  // Authentication
  token: null,
  user: null,
  isAdmin: false,
  isAuthModalOpen: false,
  isProfileModalOpen: false,
  activeReceiptInvoice: null,

  setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
  setProfileModalOpen: (open) => set({ isProfileModalOpen: open }),
  setActiveReceiptInvoice: (invoice) => set({ activeReceiptInvoice: invoice }),

  loginWithOtp: async (phoneNumber: string, code: string) => {
    const token = await verifyOtp(phoneNumber, code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nafis_token', token);
      localStorage.setItem('nafis_role', 'USER');
    }
    set({ token, isAdmin: false, isAuthModalOpen: false });
    await get().refreshProfile();
  },

  loginAsAdmin: async (username: string, pass: string) => {
    const token = await adminLoginApi(username, pass);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nafis_token', token);
      localStorage.setItem('nafis_role', 'ADMIN');
      localStorage.setItem('nafis_user', JSON.stringify({ phoneNumber: username, role: 'ADMIN', firstName: 'مدیر', lastName: 'سیستم' }));
    }
    set({ 
      token, 
      isAdmin: true, 
      isAuthModalOpen: false,
      user: { phoneNumber: username, role: 'ADMIN', firstName: 'مدیر', lastName: 'سیستم' }
    });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nafis_token');
      localStorage.removeItem('nafis_user');
      localStorage.removeItem('nafis_role');
    }
    set({ token: null, user: null, isAdmin: false, isProfileModalOpen: false });
  },

  loadUserFromStorage: async () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('nafis_token');
    const role = localStorage.getItem('nafis_role');
    const userStr = localStorage.getItem('nafis_user');
    const langStr = localStorage.getItem('nafis_language') as Language | null;

    if (langStr && (langStr === 'fa' || langStr === 'en' || langStr === 'ar')) {
      get().setLanguage(langStr);
    }

    // Instant 0ms hydration from client cache
    try {
      const cachedCats = getCachedApiData<BackendCategory[]>('categories');
      if (cachedCats && cachedCats.length > 0) {
        set({ categories: cachedCats });
      }
      const cachedProds = getCachedApiData<BackendProduct[]>('products_all');
      if (cachedProds && cachedProds.length > 0) {
        set({ 
          products: cachedProds.map(mapBackendToFrontend),
          backendProducts: cachedProds 
        });
      }
      const cachedSilver = getCachedApiData<number>('silver_price');
      if (cachedSilver && cachedSilver > 0) {
        set({ silverPricePerGramToman: cachedSilver });
      }
    } catch {}

    if (token) {
      let parsedUser = null;
      try {
        if (userStr) parsedUser = JSON.parse(userStr);
      } catch {}

      set({ 
        token, 
        isAdmin: role === 'ADMIN',
        user: parsedUser
      });
      if (role !== 'ADMIN') {
        await get().refreshProfile();
      }
    }
  },

  refreshProfile: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const profile = await getUserProfile(token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('nafis_user', JSON.stringify(profile));
      }
      set({ user: profile });
    } catch (err) {
      console.warn('Could not refresh profile:', err);
    }
  }
}))
