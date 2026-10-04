// Admin Authentication Helpers for Nafise Ebadi Jewellery

export const ADMIN_TOKEN_KEY = 'nafis_token';
export const ADMIN_ROLE_KEY = 'nafis_role';
export const ADMIN_USER_KEY = 'nafis_user';

export interface AdminUserInfo {
  username?: string;
  phoneNumber?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  const role = localStorage.getItem(ADMIN_ROLE_KEY);
  return Boolean(token && (role === 'ADMIN' || !role));
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminSession(token: string, info?: AdminUserInfo): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_ROLE_KEY, 'ADMIN');
  if (info) {
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(info));
  } else {
    localStorage.setItem(
      ADMIN_USER_KEY,
      JSON.stringify({ username: 'admin', role: 'ADMIN', firstName: 'مدیر', lastName: 'سیستم' })
    );
  }
}

export function getAdminUser(): AdminUserInfo | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(ADMIN_USER_KEY);
  if (!raw) {
    return { username: 'مدیر سیستم', role: 'مدیر ارشد' };
  }
  try {
    const data = JSON.parse(raw);
    return {
      username: data.phoneNumber || data.username || 'مدیر سیستم',
      role: data.role === 'ADMIN' ? 'مدیر ارشد' : (data.role || 'مدیر سیستم'),
      firstName: data.firstName,
      lastName: data.lastName,
    };
  } catch {
    return { username: 'مدیر سیستم', role: 'مدیر ارشد' };
  }
}

export function removeAdminSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_ROLE_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}
