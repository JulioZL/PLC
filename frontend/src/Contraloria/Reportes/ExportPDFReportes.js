import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportarReportePDF = (reportData) => {
    console.log("Report Data:", reportData); 
    if (reportData.length === 0) {
        alert("No hay datos para exportar.");
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
        `Nombre alumno: ${reportData.Nombre_Alumno}`,
        `Grupo: ${reportData.Grupo}`,
        `Mes de pago: ${reportData.Mes_de_Pago}`,
        `Semestre: ${reportData.Semestre}`,
        `Ciclo escolar: ${reportData.Ciclo_Escolar}`,
        `Fecha: ${new Date().toLocaleDateString()}`,
        `Lugar: Yuriria, GTO.`
    ];

    doc.setFontSize(10);
    let y = 50;
    detalles.forEach((detalle, index) => {
        const x = index % 2 === 0 ? margin : pageWidth / 2;
        if (index % 2 === 0 && index !== 0) y += 6; // Salto de línea para pares
        doc.text(detalle, x, y);
    });

    // Línea divisora para tabla
    y += 6;
    doc.line(margin, y, pageWidth - margin, y);

    // Tabla de conceptos
    const tableColumns = ["Concepto", "Mes de Pago", "Precio Unitario", "Cantidad", "Total"];
    const tableRows = [[
        `${reportData.Concepto}`,
        `${reportData.Mes_de_Pago}`,
        `$${parseFloat(reportData.Precio).toFixed(2)}`,
        reportData.Cantidad,
        `$${(parseFloat(reportData.Precio) * (reportData.Cantidad)).toFixed(2)}`
    ]];


    doc.autoTable({
        startY: y + 10,
        head: [tableColumns],
        body: tableRows,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [22, 160, 133], textColor: 255 },
    });

    // Total adeudado
    const totalAmount = parseFloat(reportData.Precio) * (reportData.Cantidad || 1);
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
    doc.save(`Reporte_Pago${reportData.Nombre_Alumno}_${new Date().toLocaleDateString()}.pdf`);
};

export default ExportarReportePDF;
