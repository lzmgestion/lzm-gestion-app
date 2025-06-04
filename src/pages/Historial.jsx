import React, { useEffect, useState } from "react";

const BACKUP_URL = "https://script.google.com/macros/s/AKfycbwLZwYxMIE2Rcn_YjTmy0QVXeSYqav5GWNim-kH4M3CbtCmujhKHi7PoRuC9f3mjqA/exec";

function guardarEnDrive(data, nombreArchivo) {
  fetch(BACKUP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: nombreArchivo,
      content: JSON.stringify(data),
    }),
  })
    .then((res) => res.text())
    .then((respuesta) => console.log("✅ Backup Drive:", respuesta))
    .catch((error) => console.error("❌ Error al guardar en Drive:", error));
}

export default function Historial() {
  const [registros, setRegistros] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [nuevoRegistro, setNuevoRegistro] = useState({
    equipoId: "",
    fecha: "",
    descripcion: "",
    limpiezaFiltros: false,
    presionGas: false,
    revisionFugas: false,
    tempSoplado: false,
    estadoUnidadCondensadora: false,
    estadoUnidadEvaporadora: false,
    observaciones: ""
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("historial")) || [];
    setRegistros(data);
    const listaEquipos = JSON.parse(localStorage.getItem("equipos")) || [];
    setEquipos(listaEquipos);
  }, []);

  useEffect(() => {
    localStorage.setItem("historial", JSON.stringify(registros));
    guardarEnDrive(registros, "historial.json");
  }, [registros]);

  const agregarRegistro = () => {
    if (!nuevoRegistro.equipoId || !nuevoRegistro.fecha || !nuevoRegistro.descripcion) return;
    setRegistros([...registros, nuevoRegistro]);
    setNuevoRegistro({
      equipoId: "",
      fecha: "",
      descripcion: "",
      limpiezaFiltros: false,
      presionGas: false,
      revisionFugas: false,
      tempSoplado: false,
      estadoUnidadCondensadora: false,
      estadoUnidadEvaporadora: false,
      observaciones: ""
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Historial Técnico</h1>

      <div className="grid gap-2 mb-4 bg-gray-50 p-4 rounded shadow">
        <select
          className="p-2 border rounded text-black"
          value={nuevoRegistro.equipoId}
          onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, equipoId: e.target.value })}
        >
          <option value="">Seleccionar equipo</option>
          {equipos.map((eq) => (
            <option key={eq.id} value={eq.id}>
              {eq.nombre} – {eq.cliente}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="p-2 border rounded text-black"
          value={nuevoRegistro.fecha}
          onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, fecha: e.target.value })}
        />

        <textarea
          placeholder="Descripción del trabajo realizado"
          className="p-2 border rounded text-black"
          value={nuevoRegistro.descripcion}
          onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, descripcion: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-sm text-black">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={nuevoRegistro.limpiezaFiltros}
              onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, limpiezaFiltros: e.target.checked })}
            />
            Limpieza de filtros
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={nuevoRegistro.presionGas}
              onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, presionGas: e.target.checked })}
            />
            Presión de gas verificada
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={nuevoRegistro.revisionFugas}
              onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, revisionFugas: e.target.checked })}
            />
            Revisión de fugas
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={nuevoRegistro.tempSoplado}
              onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, tempSoplado: e.target.checked })}
            />
            Temperatura de soplado medida
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={nuevoRegistro.estadoUnidadCondensadora}
              onChange={(e) =>
                setNuevoRegistro({ ...nuevoRegistro, estadoUnidadCondensadora: e.target.checked })
              }
            />
            Estado unidad condensadora revisado
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={nuevoRegistro.estadoUnidadEvaporadora}
              onChange={(e) =>
                setNuevoRegistro({ ...nuevoRegistro, estadoUnidadEvaporadora: e.target.checked })
              }
            />
            Estado unidad evaporadora revisado
          </label>
        </div>

        <textarea
          placeholder="Observaciones adicionales"
          className="p-2 border rounded mt-2 text-black"
          value={nuevoRegistro.observaciones}
          onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, observaciones: e.target.value })}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={agregarRegistro}
        >
          Agregar Registro
        </button>
      </div>

      <div className="grid gap-3">
        {registros.map((r, i) => {
          const equipo = equipos.find((e) => e.id === r.equipoId);
          return (
            <div key={i} className="bg-white p-4 border rounded shadow">
              <p className="font-bold text-lg">{equipo ? equipo.nombre : "Equipo desconocido"}</p>
              <p className="text-gray-600 text-sm mb-1">{r.fecha}</p>
              <p className="mb-2">{r.descripcion}</p>
              <ul className="list-disc pl-5 text-sm mb-2 text-gray-700">
                {r.limpiezaFiltros && <li>Limpieza de filtros</li>}
                {r.presionGas && <li>Presión de gas verificada</li>}
                {r.revisionFugas && <li>Revisión de fugas</li>}
                {r.tempSoplado && <li>Temperatura de soplado medida</li>}
                {r.estadoUnidadCondensadora && <li>Unidad condensadora revisada</li>}
                {r.estadoUnidadEvaporadora && <li>Unidad evaporadora revisada</li>}
              </ul>
              {r.observaciones && (
                <p className="text-sm text-gray-800">
                  <strong>Observaciones:</strong> {r.observaciones}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
