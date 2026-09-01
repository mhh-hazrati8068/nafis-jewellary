// API client for Silver Shop Spring Boot Backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface BackendProduct {
  id: number;
  name: string;
  livePriceToman: number;
  stockQuantity: number;
  imageUrl?: string;
  stoneName?: string;
  badge?: 'NONE' | 'SPECIAL_OFFER' | 'BEST_SELLER' | 'NEW_ARRIVAL';
  weight?: number;
  pricingMethod?: 'METHOD_1_SILVER_MAKING_STONE' | 'METHOD_2_SILVER_MAKING' | 'METHOD_3_FIXED_PRICE' | 'METHOD_4_STONE_ONLY';
  makingChargePercentage?: number;
  stonePrice?: number;
  fixedPrice?: number;
  stone?: BackendProduct;
  isVisible?: boolean;
}

export interface UserProfile {
  id?: number;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  postalCode?: string;
  role?: string;
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
  isPaid: boolean;
  createdAt: string;
}

export interface SilverPriceResponse {
  pricePerGramToman: number;
  success?: boolean;
}

function getAuthHeaders(token?: string | null): HeadersInit {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };
  const activeToken = token || (typeof window !== 'undefined' ? localStorage.getItem('nafis_token') : null);
  if (activeToken) {
    headers['Authorization'] = `Bearer ${activeToken}`;
  }
  return headers;
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
    throw new Error(errText || 'Failed to send verification code');
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
    throw new Error(errText || 'Invalid verification code');
  }
  return res.text(); // Returns JWT Token
}

export async function adminLogin(username: string, password: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/auth/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'Admin authentication failed');
  }
  return res.text(); // Returns Admin JWT Token
}

// ---------------- USER PROFILE API ----------------
export async function getUserProfile(token?: string | null): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch user profile');
  }
  return res.json();
}

export async function updateUserProfile(profile: Partial<UserProfile>, token?: string | null): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });
  if (!res.ok) {
    throw new Error('Failed to update profile');
  }
  return res.text();
}

// ---------------- PRODUCTS API ----------------
export async function fetchAllProducts(token?: string | null): Promise<BackendProduct[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'GET',
      headers: getAuthHeaders(token),
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`Products request failed: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    console.warn('Backend API offline or unreachable, using fallback data:', err);
    return [];
  }
}

export async function fetchProductById(id: number | string, token?: string | null): Promise<BackendProduct | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchLiveSilverPrice(): Promise<number> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/silver-price`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });
    if (res.ok) {
      const data: SilverPriceResponse = await res.json();
      return data.pricePerGramToman || 475000;
    }
  } catch (err) {
    console.warn('Failed to fetch live silver price:', err);
  }
  return 475000;
}

// ---------------- INVOICES & CHECKOUT API ----------------
export async function createCheckout(
  cartItemsMap: Record<number, number>,
  address: string,
  postalCode: string,
  token?: string | null
): Promise<Invoice> {
  const res = await fetch(`${API_BASE_URL}/api/invoices/checkout`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cartItems: cartItemsMap,
      address,
      postalCode,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Checkout failed');
  }
  return res.json();
}

export async function fetchMyOrders(token?: string | null): Promise<Invoice[]> {
  const res = await fetch(`${API_BASE_URL}/api/invoices/my-orders`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch orders');
  }
  return res.json();
}

export async function payInvoice(invoiceId: number, token?: string | null): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/invoices/${invoiceId}/pay`, {
    method: 'POST',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Payment failed');
  }
  return res.text();
}

// ---------------- ADMIN API ----------------
export async function fetchAdminProducts(token?: string | null): Promise<BackendProduct[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/products`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to fetch admin products');
  return res.json();
}

export async function fetchAdminStones(token?: string | null): Promise<BackendProduct[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/stones`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to fetch gemstones');
  return res.json();
}

export async function saveAdminProduct(
  formData: FormData,
  isEdit = false,
  id?: number,
  stoneId?: number,
  token?: string | null
): Promise<BackendProduct> {
  let url = isEdit ? `${API_BASE_URL}/api/admin/products/${id}` : `${API_BASE_URL}/api/admin/products`;
  if (stoneId) {
    url += `?stoneId=${stoneId}`;
  }

  const res = await fetch(url, {
    method: isEdit ? 'PUT' : 'POST',
    headers: {
      'Authorization': `Bearer ${token || localStorage.getItem('nafis_token') || ''}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to save product');
  }
  return res.json();
}

export async function deleteAdminProduct(id: number, token?: string | null): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to delete product');
  }
  return res.text();
}

export async function forceUpdateSilverPrice(token?: string | null): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/admin/update-silver-price`, {
    method: 'POST',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to update silver price');
  return res.text();
}

export async function fetchAdminInvoices(token?: string | null): Promise<Invoice[]> {
  const res = await fetch(`${API_BASE_URL}/api/admin/invoices`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to fetch admin invoices');
  return res.json();
}

export async function updateInvoiceStatus(id: number, status: string, token?: string | null): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/admin/invoices/${id}/status?status=${encodeURIComponent(status)}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to update invoice status');
  return res.text();
}
