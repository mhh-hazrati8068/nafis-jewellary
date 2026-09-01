import { create } from 'zustand'
import { Language, translations } from '@/lib/translations'
import { Product, mockProducts } from '@/data/products'
import { 
  UserProfile, 
  fetchAllProducts, 
  fetchLiveSilverPrice as getLiveSilverPriceApi,
  verifyOtp,
  adminLogin as adminLoginApi,
  getUserProfile,
  API_BASE_URL,
  BackendProduct
} from '@/lib/api'

export type { Product }
export type Theme = 'dark' | 'light';

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
  // Theme state
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void

  // Language & Direction state
  language: Language
  direction: 'rtl' | 'ltr'
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: typeof translations['en']

  // Products state
  products: Product[]
  backendProducts: BackendProduct[]
  isLoadingProducts: boolean
  getProductById: (id: number) => Product | undefined
  fetchProducts: () => Promise<void>

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
  setAuthModalOpen: (open: boolean) => void
  setProfileModalOpen: (open: boolean) => void
  loginWithOtp: (phoneNumber: string, code: string) => Promise<void>
  loginAsAdmin: (username: string, pass: string) => Promise<void>
  logout: () => void
  loadUserFromStorage: () => Promise<void>
  refreshProfile: () => Promise<void>
}

// Convert Backend product to Frontend product
function mapBackendToFrontend(bp: BackendProduct): Product {
  const imageUrl = bp.imageUrl 
    ? (bp.imageUrl.startsWith('http') ? bp.imageUrl : `${API_BASE_URL}${bp.imageUrl}`)
    : "https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=800&auto=format&fit=crop";

  return {
    id: bp.id,
    nameFa: bp.name,
    nameEn: bp.name,
    price: bp.livePriceToman || 0,
    category: 'rings',
    categoryFa: bp.stoneName ? `نقره دست‌ساز (${bp.stoneName})` : 'زیورآلات نقره',
    categoryEn: bp.stoneName ? `Handmade Silver (${bp.stoneName})` : 'Silver Jewelry',
    materialFa: `نقره ۹۹۹ عیار خالص ${bp.weight ? `(${bp.weight} گرم)` : ''}`,
    materialEn: `999 Fine Silver ${bp.weight ? `(${bp.weight}g)` : ''}`,
    descriptionFa: `طراحی اصیل نقره با فرمول قیمت‌گذاری پویا بر پایه نرخ لحظه‌ای TGJU. موجودی: ${bp.stockQuantity} عدد`,
    descriptionEn: `Authentic silver jewelry with live dynamic pricing based on daily TGJU silver rates. In stock: ${bp.stockQuantity}`,
    image: imageUrl,
    images: [imageUrl],
    weightGram: bp.weight || 4.2,
    carat: "Silver 999",
    featured: bp.badge === 'BEST_SELLER' || bp.badge === 'SPECIAL_OFFER',
  };
}

export const useAppStore = create<AppState>()((set, get) => ({
  // Theme management
  theme: 'light',
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nafis_theme', theme === 'dark' ? 'warm' : 'light');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
      }
    }
    set({ theme })
  },
  toggleTheme: () => {
    const nextTheme: Theme = get().theme === 'dark' ? 'light' : 'dark'
    get().setTheme(nextTheme)
  },

  // Language & Direction
  language: 'fa',
  direction: 'rtl',
  t: translations['fa'],

  setLanguage: (lang) => {
    const dir = lang === 'fa' ? 'rtl' : 'ltr'
    if (typeof window !== 'undefined') {
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
    const nextLang: Language = get().language === 'fa' ? 'en' : 'fa'
    get().setLanguage(nextLang)
  },

  // Products
  products: mockProducts,
  backendProducts: [],
  isLoadingProducts: false,
  getProductById: (id) => get().products.find((p) => p.id === id),

  fetchProducts: async () => {
    set({ isLoadingProducts: true })
    try {
      const { token } = get();
      const backendItems = await fetchAllProducts(token);
      if (backendItems && backendItems.length > 0) {
        const mapped = backendItems.map(mapBackendToFrontend);
        set({
          products: mapped,
          backendProducts: backendItems,
          isLoadingProducts: false,
        });
      } else {
        set({ products: mockProducts, isLoadingProducts: false });
      }
    } catch {
      set({ products: mockProducts, isLoadingProducts: false });
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
    const price = await getLiveSilverPriceApi();
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

  setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
  setProfileModalOpen: (open) => set({ isProfileModalOpen: open }),

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
    const themeStr = localStorage.getItem('nafis_theme');

    if (themeStr === 'warm') {
      get().setTheme('dark');
    }

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
