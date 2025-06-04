import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginTecnico() {
  const [clave, setClave] = useState("");
  const navigate = useNavigate();

  const ingresar = () => {
    if (clave === "tecnico123") {
      localStorage.setItem("accesoTecnico", "autorizado");
      navigate("/panel");
    } else {
      alert("Clave incorrecta");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-6 rounded shadow max-w-sm w-full">
        <h1 className="text-xl font-bold mb-4 text-center text-gray-800">Acceso Técnico</h1>
        <input
          type="password"
          placeholder="Clave técnica"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          className="p-2 border border-gray-400 rounded w-full mb-4 text-black"
        />
        <button
          onClick={ingresar}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ingresar
        </button>
      </div>
    </div>
  );
}