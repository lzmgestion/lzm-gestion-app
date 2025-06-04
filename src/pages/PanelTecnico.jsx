import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PanelEquipos from "./PanelEquipos";

function PanelTecnico() {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const autorizado = localStorage.getItem("accesoTecnico") === "autorizado";
    if (!autorizado) {
      navigate("/login-tecnico");
    }
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem("accesoTecnico");
    setMensaje("✅ Sesión cerrada correctamente");
    setTimeout(() => {
      navigate("/login-tecnico");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Panel Técnico</h1>
        <button
          onClick={cerrarSesion}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </div>

      {mensaje && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded border border-green-300">
          {mensaje}
        </div>
      )}

      <PanelEquipos />
    </div>
  );
}

export default PanelTecnico;