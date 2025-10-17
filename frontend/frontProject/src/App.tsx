import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Coordinator/Login";
import Dashboard from "./pages/Coordinator/Dashboard";
import Usuarios from "./pages/Coordinator/Users";
import Squads from "./pages/Coordinator/Squads";
import Settings from "./pages/Coordinator/Settings";
import MainLayout from "./components/Layout/MainLayout";
import Frequency from "./pages/Coordinator/Frequency"; 
import { ProtectedRoute } from "./components/Login/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública */}
        <Route path="/" element={<Login />} />

        {/* Rotas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/squads" element={<Squads />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/frequencia" element={<Frequency />} />
          </Route>
        </Route>

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}



export default App;