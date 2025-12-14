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
  import ManageRoles from "./pages/Coordinator/ManageRoles";
  import CoordinatorSettings from "./pages/Coordinator/Settings"; // Nome atualizado
  import CoordinatorFrequency from "./pages/Coordinator/Frequency"; // Nome atualizado
  import Task from "./pages/Coordinator/Task";
  import AdjustmentRequests from "./pages/Coordinator/AdjustmentRequests";
  import Notifications from "./pages/Notifications"; // Nova página de notificações

  // Páginas do Estagiário
  import MainLayoutIntern from "./components/Layout/MainLayoutIntern";
  import InternHome from "./pages/Intern/Home";
  import Ponto from "./pages/Intern/Point";
  import InternFrequency from "./pages/Intern/Frequency"; // Nome atualizado
  import InternSettings from "./pages/Intern/Settings2";   // Nome atualizado (Settings2 -> InternSettings)
  import InternTasks from "./pages/Intern/Task"; // Importe o novo componente



  export default function App() {
    return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* pública */}
            <Route path="/" element={<Login />} />

            {/* coordenador */}
            <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/usuarios" element={<Users />} />
                <Route path="/squads" element={<Squads />} />
                <Route path="/manage-roles" element={<ManageRoles />} />
                <Route path="/settings" element={<CoordinatorSettings />} />
                <Route path="/frequencia" element={<CoordinatorFrequency />} />
                <Route path="/task" element={<Task />} /> 
                <Route path="/adjustment-requests" element={<AdjustmentRequests />} />
                <Route path="/notifications" element={<Notifications />} />
              </Route>
            </Route>

            {/* estagiário (coord também pode ver) */}
            <Route element={<ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_ADMIN"]} />}>
              <Route element={<MainLayoutIntern />}>
                <Route path="/intern/home" element={<InternHome />} />
                <Route path="/intern/ponto" element={<Ponto />} />
                <Route path="/intern/frequencia" element={<InternFrequency />} />
                <Route path="/intern/settings" element={<InternSettings />} />
                <Route path="/intern/task" element={<InternTasks />} />
                <Route path="/intern/notifications" element={<Notifications />} />
              </Route>
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    );
  }