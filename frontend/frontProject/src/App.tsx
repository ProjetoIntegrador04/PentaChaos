import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Coordinator/Login";
import Dashboard from "./pages/Coordinator/Dashboard";
import Usuarios from "./pages/Coordinator/Users";
import MainLayout from "./components/Layout/MainLayout";
import { ProtectedRoute } from "./components/Login/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 Rota pública */}
        <Route path="/" element={<Login />} />

        {/* 🔒 Rotas protegidas */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/squads" element={<h2>Squads</h2>} />
          <Route path="/configuracoes" element={<h2>Configurações</h2>} />
        </Route>

        {/* fallback → qualquer rota desconhecida leva ao login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
