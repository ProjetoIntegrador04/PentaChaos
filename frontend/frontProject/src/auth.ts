// src/auth.ts
export type JwtPayload = { exp?: number; sub?: string; roles?: string | string[] };

export function getStoredToken(): string | null {
  const t = localStorage.getItem("token") ?? sessionStorage.getItem("token");
  if (!t) return null;
  const s = t.trim();
  if (!s || s === "null" || s === "undefined") return null;
  return s;
}

export function getStoredRefreshToken(): string | null {
  const t = localStorage.getItem("refreshToken") ?? sessionStorage.getItem("refreshToken");
  if (!t) return null;
  const s = t.trim();
  if (!s || s === "null" || s === "undefined") return null;
  return s;
}

export function isValidJwt(token: string | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    const payload = parseJwt(token);
    if (payload?.exp && Date.now() >= payload.exp * 1000) return false;
    return true;
  } catch {
    return false;
  }
}

export function parseJwt(token: string): JwtPayload {
  const base64 = token.split(".")[1];
  const json = atob(base64);
  return JSON.parse(json);
}

// ---- ROLES ----
export function saveRoles(roles: string[], remember: boolean) {
  const key = "roles";
  const value = JSON.stringify(roles ?? []);
  if (remember) localStorage.setItem(key, value);
  else sessionStorage.setItem(key, value);
}

export function getStoredRoles(): string[] {
  const raw = localStorage.getItem("roles") ?? sessionStorage.getItem("roles");
  if (!raw) return [];
  try { return JSON.parse(raw) ?? []; } catch { return []; }
}

export function hasAnyRole(roles: string[], allowed: string[] = []): boolean {
  if (allowed.length === 0) return true;
  const set = new Set(roles);
  return allowed.some(r => set.has(r));
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("roles");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("roles");
}
