import React, { useEffect, useState } from "react";
import SubirImagen from "../components/SubirImagen";

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [nuevoProveedor, setNuevoProveedor] = useState({ nombre: "", imagen: "" });

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("proveedores")) || [];
    setProveedores(guardados);
  }, []);

  useEffect(() => {
    localStorage.setItem("proveedores", JSON.stringify(proveedores));
  }, [proveedores]);

  const agregarProveedor = () => {
    if (nuevoProveedor.nombre.trim() === "") return;
    setProveedores([...proveedores, { ...nuevoProveedor }]);
    setNuevoProveedor({ nombre: "", imagen: "" });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Proveedores</h1>

      <div className="mb-4 grid gap-2">
        <input
          type="text"
          placeholder="Nombre del proveedor"
          value={nuevoProveedor.nombre}
          onChange={(e) => setNuevoProveedor({ ...nuevoProveedor, nombre: e.target.value })}
          className="p-2 border rounded"
        />

        <SubirImagen onImagenCargada={(img) => setNuevoProveedor({ ...nuevoProveedor, imagen: img })} />

        <button
          onClick={agregarProveedor}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Agregar Proveedor
        </button>
      </div>

      <div className="grid gap-3">
        {proveedores.map((prov, i) => (
          <div key={i} className="border p-2 rounded bg-white shadow">
            <p className="font-semibold">{prov.nombre}</p>
            {prov.imagen && (
              <img src={prov.imagen} alt="Proveedor" className="w-32 h-32 object-cover mt-2 rounded" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}