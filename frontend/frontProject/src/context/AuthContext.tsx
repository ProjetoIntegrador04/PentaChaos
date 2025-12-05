import React, { useEffect, useMemo, useState } from "react";
import { getStoredRoles, getStoredToken, isValidJwt, clearAuth } from "../auth";
import { Ctx } from "./authContext";
import type { AuthCtx } from "./authContext";

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [roles, setRoles] = useState<string[]>(() => {
    const storedRoles = getStoredRoles();
    console.log("🔑 AuthProvider init - roles from storage:", storedRoles);
    return storedRoles;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = getStoredToken();
    const valid = isValidJwt(token);
    console.log("🔑 AuthProvider init - token valid:", valid);
    return valid;
  });

  // Atualiza isAuthenticated quando roles mudam
  useEffect(() => {
    const token = getStoredToken();
    const valid = isValidJwt(token);
    console.log("🔄 AuthContext useEffect - Token validation:", { valid, roles });
    setIsAuthenticated(valid);
    if (!valid) { 
      console.log("❌ Invalid token - clearing auth");
      clearAuth(); 
      setRoles([]); 
    }
  }, [roles]);

  const value = useMemo<AuthCtx>(() => ({
    roles,
    isAuthenticated,
    setRoles: (newRoles: string[]) => {
      console.log("🔄 setRoles called with:", newRoles);
      setRoles(newRoles);
    },
    signOut: () => { 
      console.log("🚪 signOut called");
      clearAuth(); 
      setRoles([]);
      setIsAuthenticated(false);
    },
  }), [roles, isAuthenticated]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
