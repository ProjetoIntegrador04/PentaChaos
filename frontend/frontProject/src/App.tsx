// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/Login/ProtectedRoute";
import MainLayout from "./components/Layout/MainLayout";

// Páginas do coordenador
import Login from "./pages/Coordinator/Login";
import Dashboard from "./pages/Coordinator/Dashboard";
import Users from "./pages/Coordinator/Users";
import Squads from "./pages/Coordinator/Squads";
import Settings from "./pages/Coordinator/Settings";
import Frequency from "./pages/Coordinator/Frequency";

// Estagiário
import InternHome from "./pages/Intern/Home";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* pública */}
          <Route path="/" element={<Login />} />

          {/* coordenador */}
          <Route element={<ProtectedRoute allowedRoles={["ROLE_COORDINATOR"]} />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/usuarios" element={<Users />} />
              <Route path="/squads" element={<Squads />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/frequencia" element={<Frequency />} />
            </Route>
          </Route>

          {/* estagiário (coord também pode ver) */}
          <Route element={<ProtectedRoute allowedRoles={["ROLE_INTERN","ROLE_COORDINATOR"]} />}>
            <Route path="/intern/home" element={<InternHome />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
