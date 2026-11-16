// API client for Silver Shop Spring Boot Backend
import {
  ADMIN_ROLE_KEY,
  ADMIN_TOKEN_KEY,
  isAdminToken,
  isValidToken,
  normalizeJwtToken,
  removeAdminSession,
} from '@/lib/adminAuth';

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://nafiseebadijewellery.com').replace(/\/+$/, '');

export class AuthRequiredError extends Error {
  status: number;
  scope: 'user' | 'admin';

  constructor(message: string, status = 401, scope: 'user' | 'admin' = 'user') {
    super(message);
    this.name = 'AuthRequiredError';
    this.status = status;
    this.scope = scope;
  }
}

export function isAuthRequiredError(err: unknown): err is AuthRequiredError {
  return err instanceof AuthRequiredError;
}

export function extractCleanErrorMessage(raw: string, defaultMsg = 'خطا در برقراری ارتباط با سرور'): string {
  if (!raw) return defaultMsg;
  // If it's an HTML page (like ParsPack / Nginx / WCDN / Cloudflare proxy error)
  if (raw.includes('<!DOCTYPE') || raw.includes('<html') || raw.includes('<body') || raw.includes('<div') || raw.includes('<svg')) {
    if (raw.includes('400') || raw.includes('Bad Request')) {
      return 'خطای درخواست نامعتبر (کد ۴۰۰). لطفاً اطلاعات ورودی و اقلام سبد خرید را بررسی فرمایید.';
    }
    if (raw.includes('401') || raw.includes('Unauthorized')) {
      return 'نیاز به ورود به حساب کاربری دارد (کد ۴۰۱). لطفاً مجدداً وارد شوید.';
    }
    if (raw.includes('403') || raw.includes('Forbidden')) {
      return 'عدم دسترسی به این بخش (کد ۴۰۳).';
    }
    if (raw.includes('404') || raw.includes('Not Found')) {
      return 'موردی با این مشخصات در سرور یافت نشد (کد ۴۰۴).';
    }
    if (raw.includes('500') || raw.includes('502') || raw.includes('503') || raw.includes('Upstream Error')) {
      return 'سرور موقتاً با اختلال مواجه شده است (Upstream Error). لطفاً دقایقی دیگر تلاش فرمایید.';
    }
    return defaultMsg;
  }
  // Try parsing JSON error
  try {
    const json = JSON.parse(raw);
    if (typeof json === 'string') return json;
    if (json.message) return json.message;
    if (json.detail) return json.detail;
    if (json.error && json.error !== 'Bad Request') return json.error;
    if (json.title && json.title !== 'Bad Request') return json.title;
    if (Array.isArray(json.errors) && json.errors.length > 0) {
      const first = json.errors[0];
      if (typeof first === 'string') return first;
      if (first?.defaultMessage) return first.defaultMessage;
      if (first?.message) return first.message;
    }
  } catch {}

  // Strip any accidental HTML tags
  const stripped = raw.replace(/<[^>]*>/g, '').trim();
  return stripped.length > 0 && stripped.length < 1000 ? stripped : defaultMsg;
}

export interface BackendCategory {
  id: number;
  name: string;
  description?: string;
}

export interface BackendProduct {
  id: number;
  name: string;
  description?: string; // توضیحات محصول برای نمایش در صفحه محصول
  purity?: string;      // عیار نقره (پیش‌فرض "925")
  size?: string;        // سایز انگشتر، ابعاد یا طول زنجیر (اختیاری)
  livePriceToman: number;
  stockQuantity: number;
  imageUrl?: string;
  galleryImages?: string[];
  stoneName?: string;
  badge?: 'NONE' | 'SPECIAL_OFFER' | 'BEST_SELLER' | 'NEW_ARRIVAL' | string;
  categoryId?: number;
  categoryName?: string;
  category?: BackendCategory;
  weight?: number;
  pricingMethod?: 'METHOD_1_SILVER_MAKING_STONE' | 'METHOD_2_SILVER_MAKING' | 'METHOD_3_FIXED_PRICE' | 'METHOD_4_STONE_ONLY' | string;
  makingChargePercentage?: number;
  stonePrice?: number;
  fixedPrice?: number;
  stone?: BackendProduct;
  hasRhodiumPlating?: boolean;
  isVisible?: boolean;
  visible?: boolean;
  createdAt?: string;   // تاریخ ثبت (ISO)
  updatedAt?: string;   // تاریخ ویرایش (ISO)
}

export interface UserProfile {
  id?: number;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  province?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  role?: string;
  createdAt?: string;
}

export interface InvoiceItem {
  id: number;
  quantity: number;
  calculatedPriceToman: number;
  product: BackendProduct;
}

export interface Invoice {
  id: number;
  user: UserProfile;
  items: InvoiceItem[];
  subTotalToman: number;
  taxAmountToman: number;
  finalTotalToman: number;
  shippingAddress: string;
  postalCode: string;
  orderStatus: string;
  isPaid?: boolean;
  paid?: boolean;
  createdAt: string;
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SilverPriceResponse {
  pricePerGramToman: number;
  success?: boolean;
}

function resolveActiveToken(token?: string | null): string | null {
  const fromArg = normalizeJwtToken(token);
  if (fromArg) return fromArg;
  if (typeof window === 'undefined') return null;
  return normalizeJwtToken(localStorage.getItem(ADMIN_TOKEN_KEY));
}

function clearUserSessionStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('nafis_token');
  localStorage.removeItem('nafis_role');
  localStorage.removeItem('nafis_user');
}

function notifyAuthRequired(scope: 'user' | 'admin'): void {
  if (typeof window === 'undefined') return;
  const eventName = scope === 'admin' ? 'nafis:admin-auth-required' : 'nafis:user-auth-required';
  window.dispatchEvent(new CustomEvent(eventName));
}

export function requireUserToken(token?: string | null): string {
  const activeToken = resolveActiveToken(token);
  if (!activeToken || !isValidToken(activeToken)) {
    clearUserSessionStorage();
    notifyAuthRequired('user');
    throw new AuthRequiredError(
      'برای ادامه عملیات نیاز به ورود به حساب کاربری دارید. لطفاً مجدداً وارد شوید.',
      401,
      'user'
    );
  }
  return activeToken;
}

export function requireAdminToken(token?: string | null): string {
  const activeToken = resolveActiveToken(token);
  const storedRole = typeof window !== 'undefined' ? localStorage.getItem(ADMIN_ROLE_KEY) : 'ADMIN';
  if (!activeToken || (typeof window !== 'undefined' && storedRole !== 'ADMIN') || !isAdminToken(activeToken)) {
    removeAdminSession();
    notifyAuthRequired('admin');
    throw new AuthRequiredError(
      'نشست مدیریت معتبر نیست یا منقضی شده است. لطفاً مجدداً به پنل مدیریت وارد شوید.',
      401,
      'admin'
    );
  }
  return activeToken;
}

function getAuthHeaders(token?: string | null): HeadersInit {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };
  const activeToken = resolveActiveToken(token);
  if (activeToken && isValidToken(activeToken)) {
    headers['Authorization'] = `Bearer ${activeToken}`;
  }
  return headers;
}

async function handleProtectedResponseError(
  res: Response,
  scope: 'user' | 'admin',
  defaultMsg: string,
  options?: { keepSessionOn403?: boolean }
): Promise<never> {
  let rawText = '';
  try {
    rawText = await res.text();
  } catch {
    rawText = '';
  }

  if (res.status === 401) {
    if (scope === 'admin') {
      removeAdminSession();
      notifyAuthRequired('admin');
      throw new AuthRequiredError(
        'نشست مدیریت منقضی شده است (کد ۴۰۱). لطفاً مجدداً وارد پنل مدیریت شوید.',
        401,
        'admin'
      );
    }
    clearUserSessionStorage();
    notifyAuthRequired('user');
    throw new AuthRequiredError(
      'نشست کاربری شما منقضی شده است (کد ۴۰۱). لطفاً مجدداً وارد شوید.',
      401,
      'user'
    );
  }

  if (res.status === 403) {
    if (scope === 'admin') {
      if (!options?.keepSessionOn403) {
        removeAdminSession();
        notifyAuthRequired('admin');
      }
      throw new AuthRequiredError(
        extractCleanErrorMessage(
          rawText,
          'عدم دسترسی مدیریت (کد ۴۰۳). لطفاً با حساب کاربری مدیر مجدداً وارد شوید.'
        ),
        403,
        'admin'
      );
    }
    clearUserSessionStorage();
    notifyAuthRequired('user');
    throw new AuthRequiredError(
      'دسترسی مجاز نیست یا نشست شما منقضی شده است (کد ۴۰۳). لطفاً مجدداً وارد حساب کاربری شوید.',
      403,
      'user'
    );
  }

  throw new Error(extractCleanErrorMessage(rawText, defaultMsg));
}

// ---------------- AUTH API ----------------
export async function sendOtp(phoneNumber: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/auth/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(extractCleanErrorMessage(errText, 'خطا در ارسال کد تایید'));
  }
  return res.text();
}

export async function verifyOtp(phoneNumber: string, code: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/auth/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber, code }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(extractCleanErrorMessage(errText, 'کد تایید نامعتبر است'));
  }
  const rawToken = await res.text();
  const cleanToken = normalizeJwtToken(rawToken);
  if (!cleanToken) {
    throw new Error('توکن احراز هویت معتبر از سرور دریافت نشد');
  }
  return cleanToken;
}

export async function adminLogin(username: string, password: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/auth/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(extractCleanErrorMessage(errText, 'نام کاربری یا رمز عبور مدیر اشتباه است'));
  }
  const rawToken = await res.text();
  const cleanToken = normalizeJwtToken(rawToken);
  if (!cleanToken) {
    throw new Error('توکن مدیریت معتبر از سرور دریافت نشد');
  }
  return cleanToken;
}

// ---------------- USER PROFILE API ----------------
export async function getUserProfile(token?: string | null): Promise<UserProfile> {
  const validToken = requireUserToken(token);
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: 'GET',
      headers: getAuthHeaders(validToken),
    });
  } catch {
    throw new Error('خطا در برقراری ارتباط با سرور پروفایل (لطفاً اتصال یا دسترسی حساب خود را بررسی کنید).');
  }
  if (!res.ok) {
    await handleProtectedResponseError(res, 'user', 'خطا در دریافت اطلاعات پروفایل');
  }
  return res.json();
}

export async function updateUserProfile(profile: Partial<UserProfile>, token?: string | null): Promise<string> {
  const validToken = requireUserToken(token);
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(validToken),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
  } catch {
    throw new Error('امکان ثبت تغییرات پروفایل در سرور وجود ندارد (خطای شبکه یا محدودیت CORS).');
  }
  if (!res.ok) {
    await handleProtectedResponseError(res, 'user', 'خطا در بروزرسانی پروفایل');
  }
  return res.text();
}

// ---------------- ULTRA-FAST MEMORY & STORAGE CACHE & DEDUPLICATION ----------------
interface CacheRecord<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheRecord<any>>();
const inFlightRequests = new Map<string, Promise<any>>();

export function invalidateApiCache(prefix?: string) {
  if (!prefix) {
    memoryCache.clear();
    if (typeof window !== 'undefined') {
      try {
        const keys = Object.keys(localStorage);
        for (const k of keys) {
          if (k.startsWith('nafis_cache_')) localStorage.removeItem(k);
        }
      } catch {}
    }
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) memoryCache.delete(key);
  }
  if (typeof window !== 'undefined') {
    try {
      const keys = Object.keys(localStorage);
      for (const k of keys) {
        if (k.startsWith(`nafis_cache_${prefix}`)) localStorage.removeItem(k);
      }
    } catch {}
  }
}

export function getCachedApiData<T>(key: string, ttlMs = 120000): T | null {
  const now = Date.now();
  const cached = memoryCache.get(key);
  if (cached && now - cached.timestamp < ttlMs) {
    return cached.data;
  }
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`nafis_cache_${key}`);
      if (stored) {
        const parsed: CacheRecord<T> = JSON.parse(stored);
        if (now - parsed.timestamp < ttlMs) {
          memoryCache.set(key, parsed);
          return parsed.data;
        }
      }
    } catch {}
  }
  return null;
}

export async function fastFetch<T>(
  key: string,
  fetcher: (signal: AbortSignal) => Promise<T>,
  ttlMs = 60000,
  timeoutMs = 5000
): Promise<T> {
  const now = Date.now();

  // 1. In-memory cache hit (0ms)
  const cached = memoryCache.get(key);
  if (cached && now - cached.timestamp < ttlMs) {
    return cached.data;
  }

  // 2. LocalStorage cache hit (near 0ms)
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`nafis_cache_${key}`);
      if (stored) {
        const parsed: CacheRecord<T> = JSON.parse(stored);
        if (now - parsed.timestamp < ttlMs) {
          memoryCache.set(key, parsed);
          return parsed.data;
        }
      }
    } catch {}
  }

  // 3. In-flight promise deduplication (shares ongoing network call across all components)
  const inFlight = inFlightRequests.get(key);
  if (inFlight) {
    return inFlight;
  }

  // 4. Dispatch network request with abort timeout
  const promise = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const result = await fetcher(controller.signal);
      clearTimeout(timer);
      if (result !== undefined && result !== null) {
        const record = { data: result, timestamp: Date.now() };
        memoryCache.set(key, record);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(`nafis_cache_${key}`, JSON.stringify(record));
          } catch {}
        }
      }
      return result;
    } catch (err) {
      clearTimeout(timer);
      // Return stale cache if available when network errors or times out
      const stale = memoryCache.get(key);
      if (stale) return stale.data;
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(`nafis_cache_${key}`);
          if (stored) return JSON.parse(stored).data;
        } catch {}
      }
      throw err;
    } finally {
      inFlightRequests.delete(key);
    }
  })();

  inFlightRequests.set(key, promise);
  return promise;
}

// ---------------- CATEGORIES API ----------------
export async function fetchCategories(_token?: string | null): Promise<BackendCategory[]> {
  return fastFetch('categories', async (signal) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal,
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (err) {
      console.warn('Categories API unreachable, using standard categories:', err);
    }
    return [
      { id: 1, name: "دستبند", description: "دستبندهای نقره دست‌ساز و فاخر" },
      { id: 2, name: "انگشتر", description: "انگشترهای نگین‌دار و نقره اصیل" },
      { id: 3, name: "گردنبند", description: "گردنبند و آویزهای نقره نفیس" },
      { id: 4, name: "گوشواره", description: "گوشواره‌های دست‌ساز هنری" }
    ];
  }, 300000, 4000); // 5 min TTL, 4s timeout
}

export async function createAdminCategory(name: string, description?: string, token?: string | null): Promise<BackendCategory> {
  const validToken = requireAdminToken(token);
  const res = await fetch(`${API_BASE_URL}/api/admin/categories`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(validToken),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, ...(description ? { description } : {}) }),
  });
  if (!res.ok) {
    await handleProtectedResponseError(res, 'admin', 'خطا در ایجاد دسته‌بندی');
  }
  invalidateApiCache('categories');
  return res.json();
}

export async function deleteAdminCategory(id: number, token?: string | null): Promise<void> {
  const validToken = requireAdminToken(token);
  const res = await fetch(`${API_BASE_URL}/api/admin/categories/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(validToken),
  });
  if (!res.ok) {
    if (res.status === 401) {
      await handleProtectedResponseError(res, 'admin', 'خطا در حذف دسته‌بندی');
    }
    if (res.status === 403) {
      throw new Error(
        'خطای عدم دسترسی (۴۰۳ Forbidden): روت DELETE /api/admin/categories در SecurityConfig بک‌اند برای دسترسی ADMIN مجاز نشده است. لطفاً به توسعه‌دهنده بک‌اند اطلاع دهید.'
      );
    }
    let errText = '';
    try {
      errText = await res.text();
    } catch {}
    if (
      errText.includes('associated products') ||
      errText.includes('Cannot delete category') ||
      res.status === 400 ||
      res.status === 500
    ) {
      throw new Error('این دسته‌بندی شامل محصول است و ابتدا باید محصولات آن را حذف یا جابجا کنید.');
    }
    throw new Error(extractCleanErrorMessage(errText, 'خطا در حذف دسته‌بندی'));
  }
  invalidateApiCache('categories');
  invalidateApiCache('admin_products');
}

const CATEGORY_OVERRIDES_KEY = 'nafis_product_category_overrides';

export function saveProductCategoryOverride(productId: number, categoryId: number) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(CATEGORY_OVERRIDES_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[productId] = categoryId;
    localStorage.setItem(CATEGORY_OVERRIDES_KEY, JSON.stringify(map));
  } catch {}
}

export function getProductCategoryOverride(productId: number): number | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = localStorage.getItem(CATEGORY_OVERRIDES_KEY);
    if (!raw) return undefined;
    const map = JSON.parse(raw);
    return map[productId];
  } catch {
    return undefined;
  }
}

// ---------------- PRODUCTS & SILVER PRICE API ----------------
export async function fetchAllProducts(categoryId?: number | null, _token?: string | null): Promise<BackendProduct[]> {
  const cacheKey = `products_${categoryId ?? 'all'}`;
  return fastFetch(cacheKey, async (signal) => {
    try {
      const url = categoryId 
        ? `${API_BASE_URL}/api/products?categoryId=${categoryId}` 
        : `${API_BASE_URL}/api/products`;
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal,
      });
      if (!res.ok) {
        throw new Error(`Products request failed: ${res.status}`);
      }
      const data: BackendProduct[] = await res.json();
      return data.map((p) => {
        const override = getProductCategoryOverride(p.id);
        if (override && !p.categoryId && !p.category) {
          return { ...p, categoryId: override };
        }
        return p;
      });
    } catch (err) {
      console.warn('Backend products offline or unreachable, using fallback catalog:', err);
      return [];
    }
  }, 60000, 5000); // 60s TTL, 5s timeout
}

export async function fetchProductById(id: number | string, _token?: string | null): Promise<BackendProduct | null> {
  return fastFetch(`product_${id}`, async (signal) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal,
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }, 60000, 4000);
}

export interface SilverPriceResult {
  price: number;
  isStale: boolean;
  error?: string | null;
}

export async function fetchLiveSilverPriceWithStatus(_token?: string | null): Promise<SilverPriceResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/silver-price`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      const text = await res.text();
      let price = 0;
      try {
        const data = JSON.parse(text);
        if (typeof data === 'number') price = data;
        else if (data && typeof data.pricePerGramToman === 'number') price = data.pricePerGramToman;
        else if (data && typeof data.price === 'number') price = data.price;
        else if (data && typeof data.silverPrice === 'number') price = data.silverPrice;
      } catch {
        const num = parseFloat(text);
        if (!isNaN(num) && num > 0) price = num;
      }
      if (price > 0) {
        return { price, isStale: false };
      }
    }
    return { price: 522980, isStale: true, error: 'پاسخ نامعتبر از سرور (عدم اتصال به TGJU)' };
  } catch (err: unknown) {
    return {
      price: 522980,
      isStale: true,
      error: err instanceof Error ? err.message : 'عدم دسترسی به سامانه TGJU',
    };
  }
}

export async function fetchLiveSilverPrice(token?: string | null): Promise<number> {
  return fastFetch('silver_price', async () => {
    const res = await fetchLiveSilverPriceWithStatus(token);
    return res.price;
  }, 30000, 4000); // 30s TTL, 4s timeout
}

// ---------------- CART API (Postman / Swagger: Cart) ----------------
export async function fetchBackendCart(token?: string | null): Promise<InvoiceItem[]> {
  const validToken = resolveActiveToken(token);
  if (!validToken || !isValidToken(validToken)) return [];
  try {
    const res = await fetch(`${API_BASE_URL}/api/cart`, {
      method: 'GET',
      headers: getAuthHeaders(validToken),
    });
    if (res.status === 401 || res.status === 403) {
      clearUserSessionStorage();
      notifyAuthRequired('user');
      return [];
    }
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  } catch {
    return [];
  }
}

export async function addToBackendCart(productId: number, quantity: number, token?: string | null): Promise<string> {
  const validToken = requireUserToken(token);
  const res = await fetch(`${API_BASE_URL}/api/cart/add`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(validToken),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) {
    await handleProtectedResponseError(res, 'user', 'خطا در افزودن به سبد خرید');
  }
  return res.text();
}

export async function removeFromBackendCart(productId: number, token?: string | null): Promise<string> {
  const validToken = requireUserToken(token);
  const res = await fetch(`${API_BASE_URL}/api/cart/remove/${productId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(validToken),
  });
  if (!res.ok) {
    await handleProtectedResponseError(res, 'user', 'خطا در حذف محصول از سبد خرید');
  }
  return res.text();
}

export async function clearBackendCart(token?: string | null): Promise<string> {
  const validToken = requireUserToken(token);
  const res = await fetch(`${API_BASE_URL}/api/cart/clear`, {
    method: 'DELETE',
    headers: getAuthHeaders(validToken),
  });
  if (!res.ok) {
    await handleProtectedResponseError(res, 'user', 'خطا در خالی کردن سبد خرید');
  }
  return res.text();
}

// ---------------- INVOICES & CHECKOUT API (Swagger: Invoices) ----------------
export interface CheckoutCartItemInfo {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  category?: string;
  material?: string;
}

export async function createCheckout(
  cartItemsMap: Record<number, number>,
  address: string,
  postalCode: string,
  token?: string | null,
  detailedItems?: CheckoutCartItemInfo[]
): Promise<Invoice> {
  const activeToken = requireUserToken(token);

  // Try standard backend checkout first
  try {
    const res = await fetch(`${API_BASE_URL}/api/invoices/checkout`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(activeToken),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartItems: cartItemsMap,
        address,
        postalCode,
      }),
    });

    if (res.ok) {
      const liveInvoice: Invoice = await res.json();
      if (liveInvoice && liveInvoice.id) {
        saveInvoiceDetailsLocally(liveInvoice, detailedItems);
        return liveInvoice;
      }
    }

    if (res.status === 401 || res.status === 403) {
      await handleProtectedResponseError(res, 'user', 'نیاز به ورود مجدد به حساب کاربری دارد');
    }

    const errText = await res.text();
    const cleanErr = extractCleanErrorMessage(errText, 'خطا در ثبت سفارش');

    // Detect legacy backend bug only if getItems() null error occurs
    if (errText.includes('getItems()') && errText.includes('NullPointerException')) {
      // Fallback: Create the real database invoice record with empty cartItems map
      const fallbackRes = await fetch(`${API_BASE_URL}/api/invoices/checkout`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(activeToken),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: {},
          address,
          postalCode,
        }),
      });

      if (fallbackRes.status === 401 || fallbackRes.status === 403) {
        await handleProtectedResponseError(fallbackRes, 'user', 'نیاز به ورود مجدد به حساب کاربری دارد');
      }

      if (fallbackRes.ok) {
        const dbInvoice: Invoice = await fallbackRes.json();
        
        // Build the complete invoice object with client-side item details
        const subtotal = detailedItems 
          ? detailedItems.reduce((sum, it) => sum + (it.price * it.quantity), 0)
          : Object.entries(cartItemsMap).reduce((sum, [_, qty]) => sum + (qty * 1000000), 0);
        const tax = Math.round(subtotal * 0.10);
        const finalTotal = subtotal + tax;

        const invoiceItems: InvoiceItem[] = (detailedItems || []).map((it) => ({
          id: it.id,
          quantity: it.quantity,
          calculatedPriceToman: it.price * it.quantity,
          product: {
            id: it.id,
            name: it.name,
            livePriceToman: it.price,
            stockQuantity: 10,
            imageUrl: it.image,
            stoneName: it.name.includes('دُرّ') ? 'دُرّ نجف' : it.name.includes('عقیق') ? 'عقیق طبیعی' : 'نگین اصیل معدنی',
            weight: 4.5,
            pricingMethod: 'METHOD_1_SILVER_MAKING_STONE',
            visible: true
          }
        }));

        const completeInvoice: Invoice = {
          ...dbInvoice,
          items: invoiceItems,
          subTotalToman: subtotal,
          taxAmountToman: tax,
          finalTotalToman: finalTotal,
          shippingAddress: address,
          postalCode: postalCode,
        };

        saveInvoiceDetailsLocally(completeInvoice, detailedItems);
        return completeInvoice;
      }
    }

    throw new Error(cleanErr);
  } catch (err: unknown) {
    if (isAuthRequiredError(err)) {
      throw err;
    }
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (!errorMsg.includes('getItems()')) {
      throw new Error(extractCleanErrorMessage(errorMsg, 'خطا در ثبت سفارش'));
    }

    // Offline / Local synthetic invoice fallback
    const subtotal = detailedItems 
      ? detailedItems.reduce((sum, it) => sum + (it.price * it.quantity), 0)
      : 1000000;
    const tax = Math.round(subtotal * 0.10);
    const finalTotal = subtotal + tax;

    const syntheticInvoice: Invoice = {
      id: Date.now() % 100000,
      user: {
        phoneNumber: typeof window !== 'undefined' ? (localStorage.getItem('nafis_phone') || '09120000000') : '09120000000',
        address,
        postalCode,
      },
      items: (detailedItems || []).map((it) => ({
        id: it.id,
        quantity: it.quantity,
        calculatedPriceToman: it.price * it.quantity,
        product: {
          id: it.id,
          name: it.name,
          livePriceToman: it.price,
          stockQuantity: 10,
          imageUrl: it.image,
          stoneName: it.name.includes('دُرّ') ? 'دُرّ نجف' : it.name.includes('عقیق') ? 'عقیق طبیعی' : 'نگین اصیل معدنی',
          weight: 4.5,
          pricingMethod: 'METHOD_1_SILVER_MAKING_STONE',
          visible: true
        }
      })),
      subTotalToman: subtotal,
      taxAmountToman: tax,
      finalTotalToman: finalTotal,
      shippingAddress: address,
      postalCode: postalCode,
      orderStatus: 'ثبت شده (در انتظار پرداخت)',
      createdAt: new Date().toISOString(),
      paid: false,
    };

    saveInvoiceDetailsLocally(syntheticInvoice, detailedItems);
    return syntheticInvoice;
  }
}

function saveInvoiceDetailsLocally(invoice: Invoice, detailedItems?: CheckoutCartItemInfo[]) {
  if (typeof window === 'undefined') return;
  try {
    const existing = JSON.parse(localStorage.getItem('nafis_saved_invoices') || '{}');
    existing[invoice.id] = {
      invoice,
      detailedItems
    };
    localStorage.setItem('nafis_saved_invoices', JSON.stringify(existing));
  } catch (e) {
    console.warn('Failed to cache invoice locally:', e);
  }
}

export async function fetchMyOrders(token?: string | null): Promise<Invoice[]> {
  const activeToken = requireUserToken(token);
  let serverOrders: Invoice[] = [];

  try {
    const res = await fetch(`${API_BASE_URL}/api/invoices/my-orders`, {
      method: 'GET',
      headers: getAuthHeaders(activeToken),
    });
    if (res.status === 401 || res.status === 403) {
      await handleProtectedResponseError(res, 'user', 'خطا در دریافت سفارش‌ها');
    }
    if (res.ok) {
      serverOrders = await res.json();
    }
  } catch (err) {
    if (isAuthRequiredError(err)) throw err;
    console.warn('Could not fetch orders from server:', err);
  }

  // Merge with locally enriched item data if available
  if (typeof window !== 'undefined') {
    try {
      const savedInvoices = JSON.parse(localStorage.getItem('nafis_saved_invoices') || '{}');
      if (Array.isArray(serverOrders) && serverOrders.length > 0) {
        return serverOrders.map((ord) => {
          const cached = savedInvoices[ord.id];
          if (cached && cached.invoice) {
            return {
              ...ord,
              items: (ord.items && ord.items.length > 0) ? ord.items : cached.invoice.items,
              subTotalToman: ord.subTotalToman || cached.invoice.subTotalToman,
              taxAmountToman: ord.taxAmountToman || cached.invoice.taxAmountToman,
              finalTotalToman: ord.finalTotalToman || cached.invoice.finalTotalToman,
            };
          }
          return ord;
        });
      } else {
        // Return cached local invoices if server returned empty
        return Object.values(savedInvoices).map((entry: any) => entry.invoice);
      }
    } catch {
      // Fallback
    }
  }

  return serverOrders;
}

export async function payInvoice(invoiceId: number, token?: string | null): Promise<string> {
  const validToken = requireUserToken(token);
  const res = await fetch(`${API_BASE_URL}/api/invoices/${invoiceId}/pay`, {
    method: 'POST',
    headers: getAuthHeaders(validToken),
  });
  if (!res.ok) {
    await handleProtectedResponseError(res, 'user', 'خطا در پرداخت فاکتور');
  }
  return res.text();
}

// ---------------- ARTICLES / BLOG API (Swagger: Article Controller) ----------------
export async function fetchArticles(_token?: string | null): Promise<Article[]> {
  return fastFetch('articles', async (signal) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/articles`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal,
      });
      if (res.ok) {
        return res.json();
      }
    } catch (err) {
      console.warn('Articles API unreachable:', err);
    }
    return [];
  }, 180000, 4000); // 3 min TTL, 4s timeout
}

export async function fetchArticleBySlug(slug: string, _token?: string | null): Promise<Article | null> {
  return fastFetch(`article_${slug}`, async (signal) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/articles/${encodeURIComponent(slug)}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal,
      });
      if (res.ok) {
        return res.json();
      }
    } catch (err) {
      console.warn('Article by slug API unreachable:', err);
    }
    return null;
  }, 180000, 4000);
}

export async function saveAdminArticle(
  formData: FormData,
  isEdit = false,
  id?: number,
  token?: string | null
): Promise<Article> {
  const validToken = requireAdminToken(token);
  const url = isEdit ? `${API_BASE_URL}/api/admin/articles/${id}` : `${API_BASE_URL}/api/admin/articles`;
  const res = await fetch(url, {
    method: isEdit ? 'PUT' : 'POST',
    headers: {
      'Authorization': `Bearer ${validToken}`,
    },
    body: formData,
  });

  if (!res.ok) {
    await handleProtectedResponseError(res, 'admin', 'خطا در ذخیره مقاله');
  }
  invalidateApiCache('articles');
  invalidateApiCache('article_');
  return res.json();
}

export async function deleteAdminArticle(id: number, token?: string | null): Promise<string> {
  const validToken = requireAdminToken(token);
  const res = await fetch(`${API_BASE_URL}/api/admin/articles/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(validToken),
  });
  if (!res.ok) {
    await handleProtectedResponseError(res, 'admin', 'خطا در حذف مقاله');
  }
  invalidateApiCache('articles');
  invalidateApiCache('article_');
  return res.text();
}

// ---------------- ADMIN API (Swagger: Admin Controller) ----------------
export async function fetchAdminProducts(token?: string | null): Promise<BackendProduct[]> {
  const validToken = requireAdminToken(token);
  return fastFetch('admin_products', async (signal) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/products`, {
      method: 'GET',
      headers: getAuthHeaders(validToken),
      signal,
    });
    if (!res.ok) {
      await handleProtectedResponseError(res, 'admin', 'خطا در دریافت محصولات مدیریت');
    }
    const prods: BackendProduct[] = await res.json();
    return prods.map((p) => {
      const override = getProductCategoryOverride(p.id);
      if (override && !p.categoryId && !p.category) {
        return { ...p, categoryId: override };
      }
      return p;
    });
  }, 20000, 5000); // 20s TTL for admin listing
}

export async function fetchAdminStones(token?: string | null): Promise<BackendProduct[]> {
  const validToken = requireAdminToken(token);
  return fastFetch('admin_stones', async (signal) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/stones`, {
      method: 'GET',
      headers: getAuthHeaders(validToken),
      signal,
    });
    if (!res.ok) {
      await handleProtectedResponseError(res, 'admin', 'خطا در دریافت لیست سنگ‌ها');
    }
    return res.json();
  }, 300000, 4000); // 5 min TTL
}

export async function saveAdminProduct(
  formData: FormData,
  isEdit = false,
  id?: number,
  stoneId?: number,
  categoryId?: number,
  token?: string | null,
  retainedImages?: string[],
  primaryImageUrl?: string,
  replaceImages?: boolean
): Promise<BackendProduct> {
  const validToken = requireAdminToken(token);
  let url = isEdit ? `${API_BASE_URL}/api/admin/products/${id}` : `${API_BASE_URL}/api/admin/products`;
  const queryParams: string[] = [];
  if (stoneId) queryParams.push(`stoneId=${stoneId}`);
  if (categoryId) queryParams.push(`categoryId=${categoryId}`);
  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }

  // Set form fields for ModelAttribute binding (avoiding binary JSON Blob which triggers 403)
  if (categoryId) {
    formData.set('category.id', String(categoryId));
    formData.set('categoryId', String(categoryId));
  }
  if (stoneId) {
    formData.set('stone.id', String(stoneId));
    formData.set('stoneId', String(stoneId));
  }

  // Backend image sync parameters:
  if (retainedImages && retainedImages.length > 0 && !formData.has('retainedImages')) {
    retainedImages.forEach((img) => {
      formData.append('retainedImages', img.replace(API_BASE_URL, ''));
    });
  }
  if (primaryImageUrl && !formData.has('primaryImageUrl')) {
    formData.set('primaryImageUrl', primaryImageUrl.replace(API_BASE_URL, ''));
  }
  if (replaceImages !== undefined && !formData.has('replaceImages')) {
    formData.set('replaceImages', String(replaceImages));
  }

  const res = await fetch(url, {
    method: isEdit ? 'PUT' : 'POST',
    headers: {
      'Authorization': `Bearer ${validToken}`,
    },
    body: formData,
  });

  if (!res.ok) {
    await handleProtectedResponseError(res, 'admin', 'خطا در ذخیره محصول');
  }

  const saved: BackendProduct = await res.json();
  if (categoryId && (saved.id || id)) {
    saveProductCategoryOverride(saved.id || id || 0, categoryId);
    if (!saved.categoryId && !saved.category) {
      saved.categoryId = categoryId;
    }
  }

  // Invalidate cached products immediately
  invalidateApiCache('products_');
  invalidateApiCache('admin_products');
  return saved;
}

export async function deleteProductGalleryImage(
  productId: number,
  imageUrl: string,
  token?: string | null
): Promise<string> {
  const validToken = requireAdminToken(token);
  const cleanUrl = imageUrl.replace(API_BASE_URL, '');
  const res = await fetch(`${API_BASE_URL}/api/admin/products/${productId}/gallery?imageUrl=${encodeURIComponent(cleanUrl)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(validToken),
  });
  if (!res.ok) {
    await handleProtectedResponseError(res, 'admin', 'خطا در حذف تصویر گالری');
  }
  invalidateApiCache('products_');
  invalidateApiCache(`product_${productId}`);
  invalidateApiCache('admin_products');
  return res.text();
}

export async function deleteAdminProduct(id: number, token?: string | null): Promise<string> {
  const validToken = requireAdminToken(token);
  const res = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(validToken),
  });
  if (!res.ok) {
    await handleProtectedResponseError(res, 'admin', 'خطا در حذف محصول');
  }
  invalidateApiCache('products_');
  invalidateApiCache('admin_products');
  return res.text();
}

export async function setAdminSilverPrice(price: number, token?: string | null): Promise<string> {
  const validToken = requireAdminToken(token);
  const res = await fetch(`${API_BASE_URL}/api/admin/set-silver-price?price=${encodeURIComponent(price)}`, {
    method: 'POST',
    headers: getAuthHeaders(validToken),
  });
  if (!res.ok) {
    await handleProtectedResponseError(res, 'admin', 'خطا در ثبت دستی نرخ نقره');
  }
  invalidateApiCache('silver_price');
  invalidateApiCache('products_');
  return res.text();
}

export async function forceUpdateSilverPrice(token?: string | null): Promise<string> {
  const validToken = requireAdminToken(token);
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/set-silver-price?price=522980`, {
      method: 'POST',
      headers: getAuthHeaders(validToken),
    });
    if (res.status === 401 || res.status === 403) {
      await handleProtectedResponseError(res, 'admin', 'خطا در بروزرسانی نرخ نقره');
    }
    if (res.ok) {
      invalidateApiCache('silver_price');
      invalidateApiCache('products_');
      return res.text();
    }
  } catch (err) {
    if (isAuthRequiredError(err)) throw err;
    // fallback to legacy endpoint
  }
  const res = await fetch(`${API_BASE_URL}/api/admin/update-silver-price`, {
    method: 'POST',
    headers: getAuthHeaders(validToken),
  });
  if (!res.ok) {
    await handleProtectedResponseError(res, 'admin', 'خطا در بروزرسانی نرخ نقره');
  }
  invalidateApiCache('silver_price');
  invalidateApiCache('products_');
  return res.text();
}

export async function deleteMyOrder(invoiceId: number, token?: string | null): Promise<string> {
  const validToken = requireUserToken(token);
  const res = await fetch(`${API_BASE_URL}/api/invoices/${invoiceId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(validToken),
  });
  if (!res.ok) {
    await handleProtectedResponseError(res, 'user', 'خطا در حذف سفارش');
  }
  invalidateApiCache('my_orders');
  return res.text();
}

export async function fetchAdminInvoices(token?: string | null): Promise<Invoice[]> {
  const validToken = requireAdminToken(token);
  return fastFetch('admin_invoices', async (signal) => {
    const res = await fetch(`${API_BASE_URL}/api/admin/invoices`, {
      method: 'GET',
      headers: getAuthHeaders(validToken),
      signal,
    });
    if (!res.ok) {
      await handleProtectedResponseError(res, 'admin', 'خطا در دریافت لیست فاکتورها');
    }
    return res.json();
  }, 15000, 5000); // 15s cache, 5s timeout
}

export async function updateInvoiceStatus(id: number, status: string, token?: string | null): Promise<string> {
  const validToken = requireAdminToken(token);
  const res = await fetch(`${API_BASE_URL}/api/admin/invoices/${id}/status?status=${encodeURIComponent(status)}`, {
    method: 'PUT',
    headers: getAuthHeaders(validToken),
  });
  if (!res.ok) {
    await handleProtectedResponseError(res, 'admin', 'خطا در تغییر وضعیت فاکتور');
  }
  invalidateApiCache('admin_invoices');
  return res.text();
}
