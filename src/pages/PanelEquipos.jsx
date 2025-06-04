import React, { useState, useEffect } from "react";
import SubirImagen from "../components/SubirImagen";
import { QRCodeCanvas } from "qrcode.react";

export default function PanelEquipos() {
  const [equipos, setEquipos] = useState([]);
  const [nuevoEquipo, setNuevoEquipo] = useState({
    nombre: "",
    marca: "",
    modelo: "",
    serie: "",
    ubicacion: "",
    cliente: "",
    imagen: ""
  });

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("equipos")) || [];
    setEquipos(guardados);
  }, []);

  useEffect(() => {
    localStorage.setItem("equipos", JSON.stringify(equipos));
  }, [equipos]);

  const agregarEquipo = () => {
    if (!nuevoEquipo.nombre.trim()) return;

    const equipoConId = {
      ...nuevoEquipo,
      id: crypto.randomUUID()
    };

    setEquipos([...equipos, equipoConId]);
    setNuevoEquipo({
      nombre: "",
      marca: "",
      modelo: "",
      serie: "",
      ubicacion: "",
      cliente: "",
      imagen: ""
    });
  };

  const eliminarEquipo = (id) => {
    if (confirm("¿Eliminar este equipo?")) {
      setEquipos(equipos.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Panel Técnico - Gestión de Equipos</h1>

      <div className="grid gap-2 mb-4 bg-gray-50 p-4 rounded shadow">
        <input
          type="text"
          placeholder="Nombre del equipo"
          value={nuevoEquipo.nombre}
          onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, nombre: e.target.value })}
          className="p-2 border rounded text-black"
        />
        <input
          type="text"
          placeholder="Marca"
          value={nuevoEquipo.marca}
          onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, marca: e.target.value })}
          className="p-2 border rounded text-black"
        />
        <input
          type="text"
          placeholder="Modelo"
          value={nuevoEquipo.modelo}
          onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, modelo: e.target.value })}
          className="p-2 border rounded text-black"
        />
        <input
          type="text"
          placeholder="N° de Serie"
          value={nuevoEquipo.serie}
          onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, serie: e.target.value })}
          className="p-2 border rounded text-black"
        />
        <input
          type="text"
          placeholder="Ubicación física"
          value={nuevoEquipo.ubicacion}
          onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, ubicacion: e.target.value })}
          className="p-2 border rounded text-black"
        />
        <input
          type="text"
          placeholder="Cliente asociado"
          value={nuevoEquipo.cliente}
          onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, cliente: e.target.value })}
          className="p-2 border rounded text-black"
        />
        <SubirImagen onImagenCargada={(img) => setNuevoEquipo({ ...nuevoEquipo, imagen: img })} />
        <button
          onClick={agregarEquipo}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Agregar Equipo
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {equipos.map((equipo) => (
          <div key={equipo.id} className="border p-3 rounded bg-white shadow relative">
            <h2 className="text-lg font-semibold">{equipo.nombre}</h2>
            {equipo.imagen && (
              <img
                src={equipo.imagen}
                alt="Equipo"
                className="w-full h-40 object-cover mt-2 rounded"
              />
            )}
            <p className="text-sm text-gray-700 mt-2">
              <strong>Marca:</strong> {equipo.marca}<br />
              <strong>Modelo:</strong> {equipo.modelo}<br />
              <strong>Serie:</strong> {equipo.serie}<br />
              <strong>Ubicación:</strong> {equipo.ubicacion}<br />
              <strong>Cliente:</strong> {equipo.cliente}
            </p>
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Código QR</p>
              <QRCodeCanvas
                value={`https://lzmgestion.vercel.app/equipo?id=${equipo.id}`}
                size={90}
              />
            </div>
            <button
              onClick={() => eliminarEquipo(equipo.id)}
              className="mt-2 px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}