import { create } from 'zustand'
import { Language, translations } from '@/lib/translations'

export type Theme = 'dark' | 'light';

export interface Product {
  id: number
  nameFa: string
  nameEn: string
  price: number
  category: 'rings' | 'necklaces' | 'bracelets' | 'earrings'
  categoryFa: string
  categoryEn: string
  materialFa: string
  materialEn: string
  descriptionFa: string
  descriptionEn: string
  image: string
  images: string[]
  weightGram: number
  carat: string
  featured?: boolean
}

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

const mockProducts: Product[] = [
  {
    id: 1,
    nameFa: "انگشتر طلای ۱۸ عیار مینیمال",
    nameEn: "Minimalist 18K Gold Band",
    price: 250,
    category: "rings",
    categoryFa: "انگشتر",
    categoryEn: "Rings",
    materialFa: "طلای ۱۸ عیار دست‌ساز",
    materialEn: "18K Yellow Gold",
    descriptionFa: "طراحی دست‌ساز با الهام از هویت بصری زیورآلات نفیسه عبادی. ساخته شده از طلای خالص ۱۸ عیار با پرداخت نهایی صیقلی.",
    descriptionEn: "Handcrafted minimalist design inspired by the official Nafise Ebadi corporate visual identity. Made from certified 18K solid gold.",
    image: "https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop"
    ],
    weightGram: 3.4,
    carat: "18K (750)",
    featured: true
  },
  {
    id: 2,
    nameFa: "حلقه تک‌نگین الماس VVS و عقیق",
    nameEn: "VVS Diamond & Agate Solitaire Ring",
    price: 1200,
    category: "rings",
    categoryFa: "انگشتر",
    categoryEn: "Rings",
    materialFa: "طلای سفید، سنگ عقیق سرخ و الماس طبیعی",
    materialEn: "18K White Gold, Natural Agate & VVS Diamond",
    descriptionFa: "پیوند سنگ عقیق سرخ با الماس طبیعی پاک VVS و طلای سفید ۱۸ عیار. هر قطعه دارای شناسنامه رسمی اصالت کالا می‌باشد.",
    descriptionEn: "A fusion of natural red agate stone, VVS clarity diamond, and 18K white gold. Accompanied by an official certificate of authenticity.",
    image: "https://images.unsplash.com/photo-1599643478524-fb66f70a9578?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599643478524-fb66f70a9578?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=800&auto=format&fit=crop"
    ],
    weightGram: 5.2,
    carat: "18K (750)",
    featured: true
  },
  {
    id: 3,
    nameFa: "گوشواره آویز مروارید و طلا",
    nameEn: "Freshwater Pearl Drop Earrings",
    price: 340,
    category: "earrings",
    categoryFa: "گوشواره",
    categoryEn: "Earrings",
    materialFa: "مروارید پرورشی آب شیرین و طلای ۱۸ عیار",
    materialEn: "Freshwater Pearl & 18K Solid Gold",
    descriptionFa: "گوشواره آویز مروارید طبیعی پرورشی با زنجیر ظریف طلای ۱۸ عیار. ایده‌آل برای استایل‌های مدرن و رسمی.",
    descriptionEn: "Freshwater cultured pearl drop earrings linked with delicate 18K gold chain work. Designed for contemporary elegance.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop"
    ],
    weightGram: 2.8,
    carat: "18K (750)",
    featured: true
  },
  {
    id: 4,
    nameFa: "دستبند زنجیری طلای ناب ۱۸ عیار",
    nameEn: "18K Solid Gold Link Bracelet",
    price: 450,
    category: "bracelets",
    categoryFa: "دستبند",
    categoryEn: "Bracelets",
    materialFa: "طلای ۱۸ عیار خالص دست‌ساز",
    materialEn: "18K Solid Handcrafted Gold",
    descriptionFa: "دستبند زنجیری با بافت اختصاصی و قفل ایمن. ساخته شده بر اساس استاندارد وزن و عیار سازمانی برند نفیسه عبادی.",
    descriptionEn: "Handcrafted solid chain link bracelet featuring custom clasp and precision weight certification.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop"
    ],
    weightGram: 4.6,
    carat: "18K (750)",
    featured: true
  },
  {
    id: 5,
    nameFa: "گردنبند مدال عقیق و طلا",
    nameEn: "Agate Gemstone Gold Pendant Necklace",
    price: 680,
    category: "necklaces",
    categoryFa: "گردنبند",
    categoryEn: "Necklaces",
    materialFa: "سنگ عقیق طبیعی، الماس و طلای زرد",
    materialEn: "Natural Agate, Diamond & 18K Gold",
    descriptionFa: "گردنبند آویز عقیق با قاب طلا بر اساس المان‌های اصلی هویت تصویری برند (صفحه ۳ دفترچه راهنما).",
    descriptionEn: "Agate pendant necklace encased in 18K gold, designed according to the visual identity guidelines.",
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop"
    ],
    weightGram: 6.1,
    carat: "18K (750)",
    featured: false
  },
  {
    id: 6,
    nameFa: "حلقه ازدواج طلای سفید و زرد",
    nameEn: "Dual Gold Wedding Ring",
    price: 520,
    category: "rings",
    categoryFa: "انگشتر",
    categoryEn: "Rings",
    materialFa: "طلای ترکیبی سفید و زرد ۱۸ عیار",
    materialEn: "Dual Tone 18K White & Yellow Gold",
    descriptionFa: "حلقه دو رنگ طلا با طراحی مدرن و خطوط موازی صیقلی.",
    descriptionEn: "Dual-tone gold wedding band featuring parallel precision polish line work.",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop"
    ],
    weightGram: 4.1,
    carat: "18K (750)",
    featured: false
  }
];

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
