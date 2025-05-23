import React, { useState, useEffect } from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';


function HistoricoReportesInv() {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReportesPrenda = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/reportesPrenda/all');
                console.log(response);
                setReportData(response.data.data); 
                setLoading(false);
            } catch (err) {
                setError('Hubo un error al cargar los reportes');
                setLoading(false);
            }
        };

        fetchReportesPrenda();
    }, []);

    // Filtrar solo los reportes activos
    const activeReports = reportData.filter(report => report.Estado === 'Activo');

    // Calcular el total de todos los pagos activos
    const totalPagosActivos = activeReports.reduce((acc, report) => acc + report.Precio * report.Cantidad, 0);

    return (
        <Container className="reportes-prenda-container">
            <h5 className="text-center mb-4">Histórico de Reportes de Prendas</h5>
            {loading ? (
                <p>Cargando...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <Table striped bordered hover responsive className="shadow-lg rounded">
                    <thead className="table-primary">
                        <tr>
                            <th>Nombre del Alumno</th>
                            <th>Grupo</th>
                            <th>Nombre del Artículo</th>
                            <th>Talla</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map((report) => (
                            <tr key={report.Id_ReportePrenda} className={report.Estado === 'Eliminado' ? 'table-danger' : ''}>
                                <td>{report.Nombre_Alumno}</td>
                                <td>{report.Grupo}</td>
                                <td>{report.Nombre_Articulo}</td>
                                <td>{report.Talla}</td>
                                <td>{report.Precio}</td>
                                <td>{report.Cantidad}</td>
                                <td>{report.Precio * report.Cantidad}</td>
                                <td>{report.Estado}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="6" className="text-end"><strong>Total Activo</strong></td>
                            <td><strong>{totalPagosActivos}</strong></td>
                            <td></td>
                        </tr>
                    </tfoot>
                </Table>
            )}
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

export default HistoricoReportesInv;
