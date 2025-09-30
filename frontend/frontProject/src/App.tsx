// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Coordinator/Dashboard";
import Login from "./pages/Coordinator/Login";
import MainLayout from "./components/Layout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔹 Login fora do layout */}
        <Route path="/" element={<Login />} />

        {/* 🔹 Páginas dentro do layout com Sidebar */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* aqui você adiciona novas páginas */}
          <Route path="/frequencia" element={<h2>Frequência</h2>} />
          <Route path="/membros" element={<h2>Integrantes</h2>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
