import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getStoredRoles, getStoredToken, isValidJwt, clearAuth } from "../auth";

type AuthCtx = {
  roles: string[];
  isAuthenticated: boolean;
  setRoles: (r: string[]) => void;
  signOut: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [roles, setRoles] = useState<string[]>(() => getStoredRoles());

  useEffect(() => {
    const token = getStoredToken();
    if (!isValidJwt(token)) { clearAuth(); setRoles([]); }
  }, []);

  const value = useMemo<AuthCtx>(() => ({
    roles,
    isAuthenticated: isValidJwt(getStoredToken()),
    setRoles,
    signOut: () => { clearAuth(); setRoles([]); },
  }), [roles]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
