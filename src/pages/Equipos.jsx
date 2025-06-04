import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { v4 as uuidv4 } from "uuid";
import { QRCodeCanvas } from "qrcode.react";

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
    .then((res) => console.log("✅ Backup equipos en Drive:", res))
    .catch((err) => console.error("❌ Error backup equipos:", err));
}

export default function Equipos() {
  const [equipos, setEquipos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [equipoNuevo, setEquipoNuevo] = useState({
    id: "",
    nombre: "",
    marca: "",
    modelo: "",
    serie: "",
    cliente: "",
    ubicacion: "",
    imagen: "",
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [indexEditar, setIndexEditar] = useState(null);

  useEffect(() => {
    const equiposGuardados = JSON.parse(localStorage.getItem("equipos")) || [];
    const clientesGuardados = JSON.parse(localStorage.getItem("clientes")) || [];
    setEquipos(equiposGuardados);
    setClientes(clientesGuardados);
  }, []);

  useEffect(() => {
    localStorage.setItem("equipos", JSON.stringify(equipos));
    guardarEnDrive(equipos, "equipos.json");
  }, [equipos]);

  const manejarCambio = (campo, valor) => {
    setEquipoNuevo({ ...equipoNuevo, [campo]: valor });
  };

  const validarURL = (url) => {
    try {
      const u = new URL(url);
      return u.hostname.includes("google.com") && u.href.includes("maps");
    } catch {
      return false;
    }
  };

  const agregarEquipo = () => {
    if (equipoNuevo.nombre.trim() === "") return;
    if (equipoNuevo.ubicacion && !validarURL(equipoNuevo.ubicacion)) {
      alert("URL de ubicación inválida");
      return;
    }

    if (modoEdicion) {
      const copia = [...equipos];
      copia[indexEditar] = equipoNuevo;
      setEquipos(copia);
      setModoEdicion(false);
      setIndexEditar(null);
    } else {
      setEquipos([...equipos, { ...equipoNuevo, id: uuidv4() }]);
    }

    setEquipoNuevo({ id: "", nombre: "", marca: "", modelo: "", serie: "", cliente: "", ubicacion: "", imagen: "" });
  };

  const eliminar = (index) => {
    if (window.confirm("¿Eliminar este equipo?")) {
      const copia = [...equipos];
      copia.splice(index, 1);
      setEquipos(copia);
    }
  };

  const editar = (equipo, index) => {
    setEquipoNuevo(equipo);
    setModoEdicion(true);
    setIndexEditar(index);
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text("Listado de Equipos", 10, 10);

    equipos.forEach((eq, i) => {
      const y = 20 + i * 40;
      doc.text(`${i + 1}. ${eq.nombre}`, 10, y);
      doc.text(`Cliente: ${eq.cliente}`, 10, y + 6);
      doc.text(`Ubicación: ${eq.ubicacion}`, 10, y + 12);
      if (eq.imagen) doc.addImage(eq.imagen, "JPEG", 140, y, 40, 30);
    });

    doc.save("equipos.pdf");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Equipos</h1>

      <div className="grid gap-2 bg-gray-50 p-4 rounded shadow mb-6">
        <input
          className="p-2 border rounded"
          placeholder="Nombre"
          value={equipoNuevo.nombre}
          onChange={(e) => manejarCambio("nombre", e.target.value)}
        />
        <input className="p-2 border rounded" placeholder="Marca" value={equipoNuevo.marca} onChange={(e) => manejarCambio("marca", e.target.value)} />
        <input className="p-2 border rounded" placeholder="Modelo" value={equipoNuevo.modelo} onChange={(e) => manejarCambio("modelo", e.target.value)} />
        <input className="p-2 border rounded" placeholder="Serie" value={equipoNuevo.serie} onChange={(e) => manejarCambio("serie", e.target.value)} />

        <select className="p-2 border rounded" value={equipoNuevo.cliente} onChange={(e) => manejarCambio("cliente", e.target.value)}>
          <option value="">Asignar cliente</option>
          {clientes.map((c, i) => (
            <option key={i} value={c.nombre}>{c.nombre}</option>
          ))}
        </select>

        <input className="p-2 border rounded" placeholder="Ubicación (URL Google Maps)" value={equipoNuevo.ubicacion} onChange={(e) => manejarCambio("ubicacion", e.target.value)} />

        <input type="file" onChange={(e) => {
          const reader = new FileReader();
          reader.onload = (event) => manejarCambio("imagen", event.target.result);
          if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
        }} />

        <button onClick={agregarEquipo} className={`${modoEdicion ? "bg-yellow-600" : "bg-blue-600"} text-white px-4 py-2 rounded hover:opacity-90`}>
          {modoEdicion ? "Guardar Cambios" : "Agregar Equipo"}
        </button>
      </div>

      <div className="grid gap-3">
        {equipos.map((eq, i) => (
          <div key={i} className="bg-white border rounded p-4 shadow">
            <p className="font-bold">{eq.nombre}</p>
            <p className="text-sm text-gray-600">{eq.cliente}</p>
            {eq.imagen && <img src={eq.imagen} alt="img" className="w-32 h-20 object-cover rounded my-2" />}
            {eq.ubicacion && <a href={eq.ubicacion} className="text-blue-600 underline text-sm" target="_blank" rel="noreferrer">Ver ubicación</a>}
            <div className="mt-2">
              <QRCode value={`https://tusitio.com/equipo?id=${eq.id}`} size={80} />
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => editar(eq, i)} className="px-3 py-1 text-sm bg-yellow-500 text-white rounded">Editar</button>
              <button onClick={() => eliminar(i)} className="px-3 py-1 text-sm bg-red-500 text-white rounded">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={generarPDF} className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Descargar PDF</button>
    </div>
  );
}
