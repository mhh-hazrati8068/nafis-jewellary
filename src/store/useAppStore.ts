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

  // AR & 3D Try-On modal
  isArModalOpen: boolean
  openArModal: (product?: Product, targetImage?: string) => void
  closeArModal: () => void
  arProduct: Product | null
  arTargetImage: string | null
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
  selectedCategoryId: null,
  setSelectedCategoryId: (catId) => {
    set({ selectedCategoryId: catId });

    // 1. Instant optimistic local filtering (0ms feedback) from loaded backend products
    const { backendProducts } = get();
    if (backendProducts && backendProducts.length > 0) {
      const filtered = catId 
        ? backendProducts.filter((p) => (p.categoryId === catId || p.category?.id === catId))
        : backendProducts;
      set({ products: filtered.map(mapBackendToFrontend) });
    } else {
      set({ isLoadingProducts: true });
    }

    // 2. Fetch fresh from server for this category
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

  // AR & 3D Try-On modal
  isArModalOpen: false,
  arProduct: null,
  arTargetImage: null,
  openArModal: (product, targetImage) => set({
    isArModalOpen: true,
    arProduct: product || null,
    arTargetImage: targetImage || null,
  }),
  closeArModal: () => set({ isArModalOpen: false }),

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
