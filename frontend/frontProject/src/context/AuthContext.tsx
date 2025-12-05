import React, { useEffect, useMemo, useState } from "react";
import { getStoredRoles, getStoredToken, isValidJwt, clearAuth } from "../auth";
import { Ctx } from "./authContext";
import type { AuthCtx } from "./authContext";

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
