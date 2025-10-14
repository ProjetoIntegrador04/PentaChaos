// src/auth.ts
export function getStoredToken(): string | null {
  const t = localStorage.getItem("token") ?? sessionStorage.getItem("token");
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
    const payload = JSON.parse(atob(parts[1]));
    if (payload?.exp && Date.now() >= payload.exp * 1000) return false; // expirado
    return true;
  } catch {
    return false;
  }
}

export function clearToken() {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
}
