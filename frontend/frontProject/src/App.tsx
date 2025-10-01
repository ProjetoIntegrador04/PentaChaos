import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Coordinator/Login";
import Dashboard from "./pages/Coordinator/Dashboard";
import Usuarios from "./pages/Coordinator/Users"; 
import MainLayout from "./components/Layout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios" element={<Usuarios />} /> 
          <Route path="/squads" element={<h2>Squads</h2>} />
          <Route path="/configuracoes" element={<h2>Configurações</h2>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
