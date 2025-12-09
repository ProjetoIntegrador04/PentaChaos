import { useContext } from "react";
import { Ctx } from "./AuthContext";
import type { AuthCtx } from "./AuthContext";

export function useAuth(): AuthCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
