import { create } from 'zustand'
import { Language, translations } from '@/lib/translations'
import { Product, mockProducts } from '@/data/products'

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
  getProductById: (id: number) => Product | undefined

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

  // Gold price ticker
  goldPricePerGram: number
}

export const useAppStore = create<AppState>()((set, get) => ({
  // Theme management (Pure White & Ivory default, never pitch black)
  theme: typeof window !== 'undefined' && localStorage.getItem('nafis_theme') === 'warm' ? 'dark' : 'light',
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
  getProductById: (id) => get().products.find((p) => p.id === id),

  // Search Modal
  isSearchOpen: false,
  toggleSearch: (isOpen) => set((state) => ({
    isSearchOpen: isOpen !== undefined ? isOpen : !state.isSearchOpen
  })),

  // Cart State
  cart: [
    {
      id: 1,
      name: "انگشتر طلای ۱۸ عیار مینیمال",
      price: 250,
      image: "https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=600&auto=format&fit=crop",
      quantity: 1,
      category: "انگشتر"
    }
  ],
  isCartOpen: false,
  goldPricePerGram: 85.50,

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

  wishlist: [2],
  toggleWishlist: (id) => set((state) => {
    const exists = state.wishlist.includes(id)
    return {
      wishlist: exists
        ? state.wishlist.filter((wId) => wId !== id)
        : [...state.wishlist, id]
    }
  })
}))
