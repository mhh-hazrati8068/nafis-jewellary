// Admin & JWT Authentication Helpers for Nafise Ebadi Jewellery

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

export function normalizeJwtToken(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let trimmed = raw.trim();
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return null;

  // Handle JSON-wrapped token responses such as {"token":"..."} or quoted strings
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      const extracted = parsed?.token || parsed?.accessToken || parsed?.jwt;
      if (typeof extracted === 'string') {
        trimmed = extracted.trim();
      }
    } catch {
      // ignore
    }
  } else if (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length > 2) {
    trimmed = trimmed.slice(1, -1).trim();
  }

  return trimmed || null;
}

export function parseJwtPayload(token: string | null | undefined): Record<string, unknown> | null {
  const clean = normalizeJwtToken(token);
  if (!clean) return null;
  const parts = clean.split('.');
  if (parts.length !== 3) return null;
  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
      const json = decodeURIComponent(
        Array.from(window.atob(padded))
          .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('')
      );
      return JSON.parse(json) as Record<string, unknown>;
    }
    const json = Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function isJwtExpired(token: string | null | undefined, skewMs = 5000): boolean {
  const clean = normalizeJwtToken(token);
  if (!clean) return true;
  const payload = parseJwtPayload(clean);
  if (!payload) {
    // Not a standard 3-part JWT; reject obviously invalid tokens
    return clean.length < 10;
  }
  if (typeof payload.exp === 'number') {
    return payload.exp * 1000 <= Date.now() + skewMs;
  }
  return false;
}

export function isValidToken(token: string | null | undefined): boolean {
  const clean = normalizeJwtToken(token);
  if (!clean) return false;
  return !isJwtExpired(clean);
}

export function isAdminToken(token: string | null | undefined): boolean {
  if (!isValidToken(token)) return false;
  const payload = parseJwtPayload(token);
  if (!payload) return true; // Non-JWT opaque token fallback: rely on stored role

  // If the JWT explicitly specifies roles/authorities, verify it's not a plain customer token
  const rawRole = payload.role ?? payload.roles ?? payload.authorities;
  if (rawRole !== undefined) {
    const serialized = JSON.stringify(rawRole).toUpperCase();
    if (!serialized.includes('ADMIN')) {
      return false;
    }
  }
  return true;
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  const token = normalizeJwtToken(localStorage.getItem(ADMIN_TOKEN_KEY));
  const role = localStorage.getItem(ADMIN_ROLE_KEY);
  if (!token || role !== 'ADMIN' || !isAdminToken(token)) {
    // Clean up stale/expired admin session proactively to avoid 401/403 calls
    if (token && role === 'ADMIN') {
      removeAdminSession();
    }
    return false;
  }
  return true;
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  if (!isAdminLoggedIn()) return null;
  return normalizeJwtToken(localStorage.getItem(ADMIN_TOKEN_KEY));
}

export function setAdminSession(token: string, info?: AdminUserInfo): void {
  if (typeof window === 'undefined') return;
  const clean = normalizeJwtToken(token);
  if (!clean) return;
  localStorage.setItem(ADMIN_TOKEN_KEY, clean);
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
