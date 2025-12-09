import { useContext } from "react";
import { Ctx } from "./authContext";
import type { AuthCtx } from "./authContext";

export function useAuth(): AuthCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
