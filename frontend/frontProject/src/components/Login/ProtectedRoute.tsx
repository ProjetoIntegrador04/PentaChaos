import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { hasAnyRole } from "../../auth";

type Props = { allowedRoles?: string[]; redirectTo?: string; };

export const ProtectedRoute: React.FC<Props> = ({ allowedRoles = [], redirectTo = "/" }) => {
  const { isAuthenticated, roles } = useAuth();
  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;
  if (!hasAnyRole(roles, allowedRoles)) return <Navigate to={redirectTo} replace />;
  return <Outlet />;
};
