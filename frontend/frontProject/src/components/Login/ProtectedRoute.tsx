import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) {
    // 🔒 SEMPRE manda pro login se não tiver token
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
