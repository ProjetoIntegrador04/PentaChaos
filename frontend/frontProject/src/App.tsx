// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./components/Layout/MainLayout";
import { ProtectedRoute } from "./components/Login/ProtectedRoute";

// Coordinator pages
import Login from "./pages/Coordinator/Login";
import Dashboard from "./pages/Coordinator/Dashboard";
import Users from "./pages/Coordinator/Users";
import Squads from "./pages/Coordinator/Squads";
import Settings from "./pages/Coordinator/Settings";
import Frequency from "./pages/Coordinator/Frequency";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* pública */}
          <Route path="/" element={<Login />} />

          {/* coordenador */}
          <Route element={<ProtectedRoute allowedRoles={["ROLE_COORDINATOR"]} redirectTo="/" />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/usuarios" element={<Users />} />
              <Route path="/squads" element={<Squads />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/frequencia" element={<Frequency />} />
            </Route>
          </Route>

          {/* estagiário */}
          <Route element={<ProtectedRoute allowedRoles={["ROLE_INTERN", "ROLE_COORDINATOR"]} redirectTo="/" />}>
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
