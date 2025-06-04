import jsPDF from "jspdf";
import "jspdf-autotable";

export default function generarPDF(historial) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Historial Técnico", 14, 22);

  const datos = historial.map((item, index) => [
    index + 1,
    item.equipo,
    item.fecha,
    item.descripcion,
    item.tecnico,
  ]);

  doc.autoTable({
    head: [["#", "Equipo", "Fecha", "Descripción", "Técnico"]],
    body: datos,
    startY: 30,
  });

  doc.save("historial.pdf");
}