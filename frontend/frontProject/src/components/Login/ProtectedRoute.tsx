//verifica se o usuário tem permissão (exemplo: se existe um token JWT salvo).

import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  console.log("ProtectedRoute token:", token);

  if (!token) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
