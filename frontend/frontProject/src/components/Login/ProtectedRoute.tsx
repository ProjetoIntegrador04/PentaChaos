// src/components/Login/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getStoredToken, isValidJwt, clearToken } from "../../auth";

export function ProtectedRoute() {
  const location = useLocation();
  const token = getStoredToken();
  const ok = isValidJwt(token);

  if (!ok) {
    clearToken();
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
