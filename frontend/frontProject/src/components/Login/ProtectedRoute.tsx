import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { hasAnyRole } from "../../auth";

type Props = { allowedRoles?: string[]; redirectTo?: string; };

export const ProtectedRoute: React.FC<Props> = ({ allowedRoles = [], redirectTo = "/" }) => {
  const { isAuthenticated, roles } = useAuth();
  const location = useLocation();

  console.log("🛡️ ProtectedRoute check:", { 
    path: location.pathname, 
    isAuthenticated, 
    userRoles: roles, 
    allowedRoles,
    hasRole: hasAnyRole(roles, allowedRoles)
  });

  if (!isAuthenticated) {
    console.log("❌ Not authenticated - redirecting to", redirectTo);
    return <Navigate to={redirectTo} replace />;
  }
  
  if (!hasAnyRole(roles, allowedRoles)) {
    console.log("❌ Insufficient permissions - redirecting to", redirectTo);
    return <Navigate to={redirectTo} replace />;
  }
  
  console.log("✅ Access granted to", location.pathname);
  return <Outlet />;
};
