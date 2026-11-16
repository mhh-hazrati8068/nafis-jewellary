import { create } from 'zustand'
import { Language, translations } from '@/lib/translations'
import { Product } from '@/data/products'
import { mapBackendToFrontend } from '@/lib/productMapper'
import { translateDynamicText } from '@/lib/dynamicTranslator'
import { 
  UserProfile, 
  fetchAllProducts, 
  fetchLiveSilverPriceWithStatus,
  fetchProductById,
  setAdminSilverPrice,
  verifyOtp,
  adminLogin as adminLoginApi,
  getUserProfile,
  isAuthRequiredError,
  BackendProduct,
  BackendCategory,
  fetchCategories as fetchCategoriesApi,
  getCachedApiData
} from '@/lib/api'
import {
  isAdminToken,
  isValidToken,
  normalizeJwtToken,
  removeAdminSession,
  setAdminSession,
} from '@/lib/adminAuth'

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
  hasFetchedCategories: boolean
  selectedCategoryId: number | null
  setSelectedCategoryId: (catId: number | null) => void
  fetchCategories: (force?: boolean) => Promise<void>

  // Products state
  products: Product[]
  backendProducts: BackendProduct[]
  isLoadingProducts: boolean
  getProductById: (id: number) => Product | undefined
  fetchSingleProduct: (id: number) => Promise<Product | null>
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
  isSilverPriceStale: boolean
  silverPriceError: string | null
  goldPricePerGram: number
  fetchSilverPrice: () => Promise<void>
  setSilverPriceManual: (price: number) => Promise<void>

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
    { id: 4, name: "گوشواره" },
    { id: 6, name: "سنگ" }
  ],
  hasFetchedCategories: false,
  selectedCategoryId: null,
  setSelectedCategoryId: (catId) => {
    const prevCatId = get().selectedCategoryId;
    const existingBackend = get().backendProducts;

    // Avoid redundant re-fetch loops if category hasn't changed and products are already loaded
    if (prevCatId === catId && existingBackend && existingBackend.length > 0 && !get().isLoadingProducts) {
      return;
    }

    set({ selectedCategoryId: catId });

    // 1. Instant optimistic local filtering (0ms feedback) from loaded backend products
    if (existingBackend && existingBackend.length > 0) {
      const filtered = catId 
        ? existingBackend.filter((p) => (p.categoryId === catId || p.category?.id === catId))
        : existingBackend;
      set({ products: filtered.map(mapBackendToFrontend) });
    } else {
      set({ isLoadingProducts: true });
    }

    // 2. Fetch fresh from server for this category
    get().fetchProducts(catId);
  },
  fetchCategories: async (force = false) => {
    if (!force && get().hasFetchedCategories) return;
    set({ hasFetchedCategories: true });
    try {
      const { token } = get();
      const cats = await fetchCategoriesApi(token);
      if (cats && cats.length > 0) {
        set({ categories: cats });
      }
    } catch (err) {
      set({ hasFetchedCategories: false });
      console.warn('Could not load categories:', err);
    }
  },

  // Products (only real products from live backend)
  products: [],
  backendProducts: [],
  isLoadingProducts: false,
  getProductById: (id) => get().products.find((p) => p.id === id),

  fetchSingleProduct: async (id: number) => {
    const existing = get().products.find((p) => p.id === id);
    if (existing) return existing;
    try {
      const { token } = get();
      const bp = await fetchProductById(id, token);
      if (bp) {
        const mapped = mapBackendToFrontend(bp);
        set((state) => ({
          products: [...state.products.filter((p) => p.id !== id), mapped],
        }));
        return mapped;
      }
    } catch (err) {
      console.warn(`Failed to fetch single product ${id}:`, err);
    }
    return null;
  },

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
        // Sort newest first by createdAt (ISO date) or fallback to ID
        const sortedItems = [...backendItems].sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return (b.id || 0) - (a.id || 0);
        });
        const mapped = sortedItems.map(mapBackendToFrontend);
        set({
          products: mapped,
          backendProducts: targetCatId ? (get().backendProducts.length > 0 ? get().backendProducts : sortedItems) : sortedItems,
          isLoadingProducts: false,
        });
      } else {
        set({ products: [], isLoadingProducts: false });
      }
    } catch (err) {
      console.warn('Could not load products from backend:', err);
      set({ products: [], isLoadingProducts: false });
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
  silverPricePerGramToman: 522980,
  isSilverPriceStale: false,
  silverPriceError: null,
  goldPricePerGram: 85.50,

  fetchSilverPrice: async () => {
    const { token } = get();
    const res = await fetchLiveSilverPriceWithStatus(token);
    set({ 
      silverPricePerGramToman: res.price,
      isSilverPriceStale: res.isStale,
      silverPriceError: res.isStale ? (res.error || 'نرخ نقره به‌روز نیست (آفلاین)') : null,
    });
  },

  setSilverPriceManual: async (price: number) => {
    const { token } = get();
    await setAdminSilverPrice(price, token);
    set({
      silverPricePerGramToman: price,
      isSilverPriceStale: false,
      silverPriceError: null,
    });
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

  wishlist: [],
  toggleWishlist: (id) => set((state) => {
    const exists = state.wishlist.includes(id);
    const updatedWishlist = exists
      ? state.wishlist.filter((wId) => wId !== id)
      : [...state.wishlist, id];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('nafis_wishlist', JSON.stringify(updatedWishlist));
      } catch {}
    }
    return { wishlist: updatedWishlist };
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
    const rawToken = await verifyOtp(phoneNumber, code);
    const token = normalizeJwtToken(rawToken);
    if (!token || !isValidToken(token)) {
      throw new Error('توکن احراز هویت معتبر نیست. لطفاً مجدداً تلاش کنید.');
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('nafis_token', token);
      localStorage.setItem('nafis_role', 'USER');
    }
    set({ token, isAdmin: false, isAuthModalOpen: false });
    await get().refreshProfile();
  },

  loginAsAdmin: async (username: string, pass: string) => {
    const rawToken = await adminLoginApi(username, pass);
    const token = normalizeJwtToken(rawToken);
    if (!token || !isAdminToken(token)) {
      throw new Error('توکن مدیریت معتبر دریافت نشد.');
    }
    const adminInfo = { phoneNumber: username, username, role: 'ADMIN', firstName: 'مدیر', lastName: 'سیستم' };
    setAdminSession(token, adminInfo);
    set({ 
      token, 
      isAdmin: true, 
      isAuthModalOpen: false,
      user: { phoneNumber: username, role: 'ADMIN', firstName: 'مدیر', lastName: 'سیستم' }
    });
  },

  logout: () => {
    removeAdminSession();
    set({ token: null, user: null, isAdmin: false, isProfileModalOpen: false });
  },

  loadUserFromStorage: async () => {
    if (typeof window === 'undefined') return;
    const rawToken = localStorage.getItem('nafis_token');
    const token = normalizeJwtToken(rawToken);
    const role = localStorage.getItem('nafis_role');
    const userStr = localStorage.getItem('nafis_user');
    const langStr = localStorage.getItem('nafis_language') as Language | null;

    if (langStr && (langStr === 'fa' || langStr === 'en' || langStr === 'ar')) {
      get().setLanguage(langStr);
    }

    try {
      const savedWishlist = localStorage.getItem('nafis_wishlist');
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          set({ wishlist: parsedWishlist.filter((id): id is number => typeof id === 'number') });
        }
      }
    } catch {}

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
      const valid = role === 'ADMIN' ? isAdminToken(token) : isValidToken(token);
      if (!valid) {
        // Clear expired/invalid stored token immediately so we don't trigger 401/403 later
        removeAdminSession();
        set({ token: null, isAdmin: false, user: null });
        return;
      }

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
    if (!token || !isValidToken(token)) {
      if (token) get().logout();
      return;
    }
    try {
      const profile = await getUserProfile(token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('nafis_user', JSON.stringify(profile));
      }
      set({ user: profile });
    } catch (err) {
      if (isAuthRequiredError(err)) {
        get().logout();
        return;
      }
      console.warn('Could not refresh profile:', err);
    }
  }
}))
