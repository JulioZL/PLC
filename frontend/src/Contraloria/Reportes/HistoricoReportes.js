import React, { useState, useEffect } from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import './HistoricoReportes.css'; // Puedes agregar estilos personalizados en este archivo

function HistoricoReportes() {

    const [reportData, setReportData] = useState([]);
    const [formData, setFormData] = useState({
        Id_ReporteSemestral: '',
        Nombre_Alumno: '',
        Semestre: '',
        Grupo: '',
        Concepto: '',
        Precio: '',
        Cantidad: '',
        Mes_de_Pago: '',
        Ciclo_Escolar: '',
        Estado: 'Activo',
        Fecha_Creacion: '',
        Fecha_Modificacion: '',
        Fecha_Eliminacion: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para cargar los reportes desde la API
    useEffect(() => {
        const fetchReportes = async () => {
            try {
                const response = await axios.get('https://plc-j41x.onrender.com/api/reportes/all'); // Ajusta la URL según sea necesario
                console.log(response)
                setReportData(response.data.data); // Asumiendo que la respuesta tiene una propiedad 'data'
                setLoading(false);
            } catch (err) {
                setError('Hubo un error al cargar los reportes');
                setLoading(false);
            }
        };

        fetchReportes();
    }, []);

    // Filtrar solo los reportes activos
    const activeReports = reportData.filter(report => report.Estado === 'Activo');

    // Calcular el total de todos los pagos activos
    const totalPagosActivos = activeReports.reduce((acc, report) => acc + report.Total, 0);

    return (
        <Container className="reportes-container">
            <h5 className="text-center mb-4">Histórico de Reportes de Pago</h5>
            <Table striped bordered hover responsive className="shadow-lg rounded">
                <thead className="table-primary">
                    <tr>
                        <th>Nombre del Alumno</th>
                        <th>Semestre</th>
                        <th>Grupo</th>
                        <th>Concepto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                        <th>Mes de Pago</th>
                        <th>Ciclo Escolar</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {reportData.map((report) => (
                        <tr key={report.Id_ReporteSemestral} className={report.Estado === 'Eliminado' ? 'table-danger' : ''}>
                            <td>{report.Nombre_Alumno}</td>
                            <td>{report.Semestre}</td>
                            <td>{report.Grupo}</td>
                            <td>{report.Concepto}</td>
                            <td>{report.Precio}</td>
                            <td>{report.Cantidad}</td>
                            <td>{report.Total}</td>
                            <td>{report.Mes_de_Pago}</td>
                            <td>{report.Ciclo_Escolar}</td>
                            <td>{report.Estado}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="9" className="text-end"><strong>Total Activo</strong></td>
                        <td><strong>{totalPagosActivos}</strong></td>
                    </tr>
                </tfoot>
            </Table>
            <Row className="mt-3">
                <Col>
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-primary">Generar Reporte</button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default HistoricoReportes;
