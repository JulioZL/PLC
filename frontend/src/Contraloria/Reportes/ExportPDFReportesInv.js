import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportReportePDFInv = (reportData, formData) => {
    if (reportData.length === 0) {
        alert('No hay datos para exportar.');
        return;
    }

    const doc = new jsPDF();

    // Configuración de estilos y márgenes
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;

    // Título de la escuela
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('ESCUELA PREPARATORIA FEDERAL POR COOPERACIÓN', pageWidth / 2, 15, { align: 'center' });
    doc.text('"GENERAL LÁZARO CÁRDENAS"', pageWidth / 2, 22, { align: 'center' });

    // Información adicional de la escuela
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('C.C.T: 11SBC2051U            Clave: EMS-2/51', pageWidth / 2, 30, { align: 'center' });
    doc.text('PROLG. 5 DE MAYO #23   TEL/FAX: (445) 168 28 55', pageWidth / 2, 35, { align: 'center' });
    doc.text('e-mail: prelazaroyuri@hotmail.com', pageWidth / 2, 40, { align: 'center' });

    // Línea divisora
    doc.setLineWidth(0.5);
    doc.line(margin, 42, pageWidth - margin, 42);

    // Detalles del alumno y del reporte
    const detalles = [
        `Nombre alumno: ${formData.nombreAlumno}`,
        `Lugar: ${formData.lugar}`,
        `Fecha: ${formData.fecha}`
    ];

    doc.setFontSize(10);
    let y = 50;
    detalles.forEach((detalle) => {
        doc.text(detalle, margin, y);
        y += 6;
    });

    // Línea divisora para tabla
    y += 4;
    doc.line(margin, y, pageWidth - margin, y);

    // Tabla de artículos
    const tableColumns = ["Nombre del Artículo", "Talla", "Precio Unitario", "Cantidad", "Subtotal"];
    const tableRows = reportData.map(item => [
        item.nombreArticulo,
        item.talla,
        `$${item.precio.toFixed(2)}`,
        item.cantidad,
        `$${item.subtotal.toFixed(2)}`
    ]);

    doc.autoTable({
        startY: y + 10,
        head: [tableColumns],
        body: tableRows,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: {
            fillColor: [10, 44, 80], textColor: 255 },
    });

    // Total adeudado
    const totalAmount = reportData.reduce((acc, item) => acc + item.subtotal, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Adeudado: $${totalAmount.toFixed(2)}`, margin, doc.lastAutoTable.finalY + 10);

    // Notas al pie
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('Firma departamento Contaloría', margin, doc.lastAutoTable.finalY + 30);
    doc.text('Sello', pageWidth - margin - 20, doc.lastAutoTable.finalY + 30);
    doc.line(margin, doc.lastAutoTable.finalY + 32, margin + 50, doc.lastAutoTable.finalY + 32); // Línea firma
    doc.line(pageWidth - margin - 50, doc.lastAutoTable.finalY + 32, pageWidth - margin, doc.lastAutoTable.finalY + 32); // Línea sello

    // Guardar PDF
    doc.save(`Reporte_${formData.nombreAlumno}_${formData.fecha.replace(/\//g, '-')}.pdf`);
    alert('El reporte se ha exportado exitosamente.');
};

export default ExportReportePDFInv;
