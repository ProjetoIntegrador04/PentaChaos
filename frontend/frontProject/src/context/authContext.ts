import { createContext } from "react";

export type AuthCtx = {
  roles: string[];
  isAuthenticated: boolean;
  setRoles: (r: string[]) => void;
  signOut: () => void;
};

export const Ctx = createContext<AuthCtx | null>(null);
