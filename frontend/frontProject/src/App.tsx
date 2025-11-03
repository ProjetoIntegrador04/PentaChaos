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

// Páginas do Estagiário
import MainLayoutIntern from "./components/Layout/MainLayoutIntern";
import InternHome from "./pages/Intern/Home";
import Ponto from "./pages/Intern/Point";
import Frequencia from "./pages/Intern/Frequency";
import Settings2 from "./pages/Intern/Settings2";


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
              <Route path="/frequencia" element={<Frequency/>} />
            </Route>
          </Route>

          {/* estagiário (coord também pode ver) */}
          <Route element={<ProtectedRoute allowedRoles={["ROLE_INTERN", "ROLE_COORDINATOR"]} />}>
            <Route element={<MainLayoutIntern />}>
              <Route path="/intern/home" element={<InternHome />} />
              <Route path="/intern/ponto" element={<Ponto />} />
              <Route path="/intern/frequencia" element={<Frequencia />} />
              <Route path="/intern/settings" element={<Settings2 />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}