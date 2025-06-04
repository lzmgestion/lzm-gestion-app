import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Clientes from "./pages/Clientes";
import Equipos from "./pages/Equipos";
import Proveedores from "./pages/Proveedores";
import Empleados from "./pages/Empleados";
import Historial from "./pages/Historial";
import PanelEquipos from "./pages/PanelEquipos";
import LoginTecnico from "./pages/LoginTecnico";
import PanelTecnico from "./pages/PanelTecnico";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
          <div className="flex items-center space-x-4">
            <img
              src="/logo-lzm.jpg"
              alt="logo LZM"
              className="h-14 w-14 rounded-full border-2 border-blue-500"
            />
            <div>
              <h1 className="text-2xl font-bold text-blue-400">LZM SOLUCIONES</h1>
              <p className="text-sm text-orange-400">Soluciones integrales en climatización y energía</p>
            </div>
          </div>
          {/* Menú de navegación */}
          <nav className="space-x-3">
            <Link to="/" className="hover:text-orange-400">Inicio</Link>
            <Link to="/clientes" className="hover:text-orange-400">Clientes</Link>
            <Link to="/equipos" className="hover:text-orange-400">Equipos</Link>
            <Link to="/proveedores" className="hover:text-orange-400">Proveedores</Link>
            <Link to="/empleados" className="hover:text-orange-400">Empleados</Link>
            <Link to="/historial" className="hover:text-orange-400">Historial</Link>
          </nav>
        </header>

        {/* Contenido */}
        <main className="p-6">
          <Routes>
           <Route path="/" element={<Clientes />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/equipos" element={<Equipos />} />
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/empleados" element={<Empleados />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/login-tecnico" element={<LoginTecnico />} />
            <Route path="/panel" element={<PanelTecnico />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}