import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MainLayout from './components/Layout/MainLayout'; 

const Usuarios = () => <div><h1>Página de Usuários</h1></div>;
const Squads = () => <div><h1>Página de Squads</h1></div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/squads" element={<Squads />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;