import React, { useState, useEffect } from "react";
import SubirImagen from "../components/SubirImagen";

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({ nombre: "", imagen: "" });

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("empleados")) || [];
    setEmpleados(guardados);
  }, []);

  useEffect(() => {
    localStorage.setItem("empleados", JSON.stringify(empleados));
  }, [empleados]);

  const agregarEmpleado = () => {
    if (nuevoEmpleado.nombre.trim() === "") return;

    setEmpleados([...empleados, { ...nuevoEmpleado }]);
    setNuevoEmpleado({ nombre: "", imagen: "" });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Empleados</h1>

      <div className="mb-4 grid gap-2">
        <input
          type="text"
          placeholder="Nombre del empleado"
          value={nuevoEmpleado.nombre}
          onChange={(e) =>
            setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })
          }
          className="p-2 border rounded text-black"
        />

        <SubirImagen
          onImagenCargada={(img) =>
            setNuevoEmpleado({ ...nuevoEmpleado, imagen: img })
          }
        />

        <button
          onClick={agregarEmpleado}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Agregar Empleado
        </button>
      </div>

      <div className="grid gap-3">
        {empleados.map((empleado, i) => (
          <div key={i} className="border p-2 rounded bg-white shadow">
            <p className="font-semibold">{empleado.nombre}</p>
            {empleado.imagen && (
              <img
                src={empleado.imagen}
                alt="Empleado"
                className="w-32 h-32 object-cover mt-2 rounded"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}