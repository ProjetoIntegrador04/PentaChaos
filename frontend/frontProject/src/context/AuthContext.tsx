import React, { createContext, useEffect, useMemo, useState } from "react";
import { getStoredRoles, getStoredToken, isValidJwt, clearAuth } from "../auth";

// Tipos e Context
export type AuthCtx = {
  roles: string[];
  isAuthenticated: boolean;
  setRoles: (r: string[]) => void;
  signOut: () => void;
};

export const Ctx = createContext<AuthCtx | null>(null);

// Provider
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

  // Validação única no mount
  useEffect(() => {
    const token = getStoredToken();
    const valid = isValidJwt(token);
    console.log("🔄 AuthContext mount - Token validation:", { valid });
    
    if (!valid && roles.length > 0) { 
      console.log("❌ Invalid token on mount - clearing auth");
      clearAuth(); 
      setRoles([]);
      setIsAuthenticated(false);
    }
  }, []); // Array vazio - executa apenas no mount

  // Atualiza isAuthenticated quando roles mudam
  useEffect(() => {
    const token = getStoredToken();
    const valid = isValidJwt(token);
    setIsAuthenticated(valid && roles.length > 0);
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
