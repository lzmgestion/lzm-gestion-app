import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import SubirImagen from "../components/SubirImagen";
import DriveUploader from "../components/DriveUploader";

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

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    imagen: "",
    ubicacion: "",
    zona: "",
    telefono: "",
    email: "",
    etiquetas: ""
  });
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [indiceEdicion, setIndiceEdicion] = useState(null);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("clientes")) || [];
    setClientes(guardados);
  }, []);

  useEffect(() => {
    localStorage.setItem("clientes", JSON.stringify(clientes));
    guardarEnDrive(clientes, "clientes.json");
  }, [clientes]);

  const esURLValida = (url) => {
    try {
      const u = new URL(url);
      return u.hostname.includes("google.com") && u.href.includes("maps");
    } catch {
      return false;
    }
  };

  const agregarCliente = () => {
    if (nuevoCliente.nombre.trim() === "") return;
    if (nuevoCliente.ubicacion && !esURLValida(nuevoCliente.ubicacion)) {
      alert("La URL de Google Maps no es válida");
      return;
    }

    if (modoEdicion) {
      const copia = [...clientes];
      copia[indiceEdicion] = { ...nuevoCliente };
      setClientes(copia);
      setModoEdicion(false);
      setIndiceEdicion(null);
    } else {
      setClientes([...clientes, { ...nuevoCliente }]);
    }

    setNuevoCliente({ nombre: "", imagen: "", ubicacion: "", zona: "", telefono: "", email: "", etiquetas: "" });
  };

  const eliminarCliente = (index) => {
    if (window.confirm("¿Estás seguro de eliminar este cliente?")) {
      const copia = [...clientes];
      copia.splice(index, 1);
      setClientes(copia);
      if (clienteSeleccionado === clientes[index]) setClienteSeleccionado(null);
    }
  };

  const editarCliente = (cliente, index) => {
    setNuevoCliente(cliente);
    setModoEdicion(true);
    setIndiceEdicion(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text("Listado de Clientes", 10, 10);
    clientes.forEach((cliente, index) => {
      const y = 20 + index * 50;
      doc.text(`${index + 1}. ${cliente.nombre}`, 10, y);
      if (cliente.zona) doc.text(`Zona: ${cliente.zona}`, 10, y + 5);
      if (cliente.telefono) doc.text(`Tel: ${cliente.telefono}`, 10, y + 10);
      if (cliente.email) doc.text(`Email: ${cliente.email}`, 10, y + 15);
      if (cliente.ubicacion) doc.text(`Ubicación: ${cliente.ubicacion}`, 10, y + 20);
      if (cliente.imagen) {
        doc.addImage(cliente.imagen, "JPEG", 10, y + 25, 30, 30);
      }
    });
    doc.save("clientes.pdf");
  };

  const clientesFiltrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    c.zona.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{modoEdicion ? "Editar Cliente" : "Clientes por Zona"}</h1>

      <div className="mb-4 grid gap-2">
        <input type="text" placeholder="Nombre del cliente" value={nuevoCliente.nombre} onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })} className="p-2 border rounded text-black" />
        <input type="text" placeholder="Zona (ej: Caleta Olivia)" value={nuevoCliente.zona} onChange={(e) => setNuevoCliente({ ...nuevoCliente, zona: e.target.value })} className="p-2 border rounded text-black" />
        <input type="text" placeholder="Ubicación Google Maps (URL)" value={nuevoCliente.ubicacion} onChange={(e) => setNuevoCliente({ ...nuevoCliente, ubicacion: e.target.value })} className="p-2 border rounded text-black" />
        <input type="text" placeholder="Teléfono" value={nuevoCliente.telefono} onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })} className="p-2 border rounded text-black" />
        <input type="email" placeholder="Email" value={nuevoCliente.email} onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })} className="p-2 border rounded text-black" />
        <input type="text" placeholder="Etiquetas (ej: VIP, urgencia)" value={nuevoCliente.etiquetas} onChange={(e) => setNuevoCliente({ ...nuevoCliente, etiquetas: e.target.value })} className="p-2 border rounded text-black" />

        <SubirImagen onImagenCargada={(img) => setNuevoCliente({ ...nuevoCliente, imagen: img })} />

        <button onClick={agregarCliente} className={`$ {modoEdicion ? "bg-yellow-600 hover:bg-yellow-700" : "bg-blue-600 hover:bg-blue-700"} text-white px-4 py-2 rounded`}>
          {modoEdicion ? "Guardar Cambios" : "Agregar Cliente"}
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre o zona"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      {clientesFiltrados.length === 0 && <p className="text-gray-500 mt-4">No hay clientes cargados.</p>}

      {[...new Set(clientesFiltrados.map(c => c.zona))].map((zona) => (
        <div key={zona} className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-blue-800">Zona: {zona}</h2>
          <div className="grid gap-3">
            {clientesFiltrados.filter(c => c.zona === zona).map((cliente, index) => (
              <div key={index} className="border p-2 rounded bg-white shadow hover:bg-gray-100">
                <p className="font-semibold">{cliente.nombre}</p>
                {cliente.imagen && <img src={cliente.imagen} alt="Cliente" className="w-32 h-32 object-cover mt-2 rounded" />}
                {cliente.ubicacion && <a href={cliente.ubicacion} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mt-2 block">Ver en Google Maps</a>}
                {cliente.telefono && <p className="text-sm mt-1">📞 {cliente.telefono}</p>}
                {cliente.email && <p className="text-sm">✉️ {cliente.email}</p>}
                {cliente.etiquetas && <p className="text-sm">🏷 {cliente.etiquetas}</p>}
                <div className="mt-2 flex gap-2">
                  <button onClick={() => setClienteSeleccionado(cliente)} className="px-2 py-1 text-sm bg-green-500 text-white rounded">Ver</button>
                  <button onClick={() => editarCliente(cliente, index)} className="px-2 py-1 text-sm bg-yellow-500 text-white rounded">Editar</button>
                  <button onClick={() => eliminarCliente(index)} className="px-2 py-1 text-sm bg-red-500 text-white rounded">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <DriveUploader data={clientes} />

      {clienteSeleccionado && (
        <div id="detalle-cliente" className="mt-6 p-4 border rounded bg-white shadow">
          <h2 className="text-lg font-bold mb-2">Detalles del Cliente</h2>
          <p><strong>Nombre:</strong> {clienteSeleccionado.nombre}</p>
          <p><strong>Zona:</strong> {clienteSeleccionado.zona}</p>
          {clienteSeleccionado.telefono && <p><strong>Teléfono:</strong> {clienteSeleccionado.telefono}</p>}
          {clienteSeleccionado.email && <p><strong>Email:</strong> {clienteSeleccionado.email}</p>}
          {clienteSeleccionado.etiquetas && <p><strong>Etiquetas:</strong> {clienteSeleccionado.etiquetas}</p>}
          {clienteSeleccionado.imagen && <img src={clienteSeleccionado.imagen} alt="Cliente" className="w-32 h-32 object-cover mt-2 rounded" />}
          {clienteSeleccionado.ubicacion && (
            <p className="mt-2">
              <a href={clienteSeleccionado.ubicacion} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver ubicación</a>
            </p>
          )}
          <button onClick={() => setClienteSeleccionado(null)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Cerrar</button>
        </div>
      )}

      <button onClick={generarPDF} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-6">Descargar PDF</button>
    </div>
  );
}
