import React, { useState, useEffect } from 'react';
import {
    Table,
    Container,
    Row,
    Col,
    InputGroup,
    FormControl,
    Pagination,
    Spinner,
    Badge,
    Button,
    Card,
    Form
} from 'react-bootstrap';
import axios from 'axios';
import { FaChevronDown, FaChevronUp, FaEdit, FaPaperclip } from 'react-icons/fa';

function HistoricoReportesInv() {
    const [reportData, setReportData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [reportsPerPage] = useState(15);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);

    useEffect(() => {
        const fetchReportesPrenda = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/reportesPrenda/all');
                setReportData(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Hubo un error al cargar los reportes');
                setLoading(false);
            }
        };

        fetchReportesPrenda();
    }, []);

    const filteredReports = reportData.filter(report =>
        report.alumno?.NombreAlumno.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //busca el reporte del alumno cuando se utiliza el filtro de buscar
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const calcularTotalReporte = (detalles = []) =>
        detalles.reduce((acc, d) => acc + parseFloat(d.precio) * d.cantidad, 0);

    const totalActivos = reportData
        .filter(r => r.estado === 'Activo')
        .reduce((acc, r) => acc + calcularTotalReporte(r.detalles), 0);

    const totalEliminados = reportData
        .filter(r => r.estado === 'Eliminado')
        .reduce((acc, r) => acc + calcularTotalReporte(r.detalles), 0);

    const toggleRow = (id) => {
        setExpandedRow(prev => (prev === id ? null : id));
    };

    // Paginación
    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
    const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

    //Renderizacion de la paginacion en la tabla, funciones de avanzar o retroceder en paginacion
    const renderPagination = () => (
        <Pagination className="justify-content-center mt-3">
            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
            {[...Array(totalPages)].map((_, idx) => (
                <Pagination.Item
                    key={idx + 1}
                    active={currentPage === idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                >
                    {idx + 1}
                </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
    );

    return (
        <Container className="py-4">
            <Card className="shadow">
                <Card.Body>
                    <Card.Title className="text-center mb-4 text-uppercase border-bottom pb-2">
                        <FaPaperclip className="me-2" /> Histórico de Reportes de Inventario
                    </Card.Title>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Buscar por nombre del alumno"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </InputGroup>
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : error ? (
                        <p className="text-danger text-center">{error}</p>
                    ) : (
                        <>
                            <Table bordered hover responsive className="table-sm">
                                <thead>
                                    <tr>
                                        <th style={{ paddingTop: '15px', paddingBottom: '15px', verticalAlign: 'middle', backgroundColor: '#274E7B', color: 'white' }}>Detalles</th>
                                        <th style={{ paddingTop: '15px', paddingBottom: '15px', verticalAlign: 'middle', backgroundColor: '#274E7B', color: 'white' }}>Folio</th>
                                        <th style={{ paddingTop: '15px', paddingBottom: '15px', verticalAlign: 'middle', backgroundColor: '#274E7B', color: 'white' }}>Alumno</th>
                                        <th style={{ paddingTop: '15px', paddingBottom: '15px', verticalAlign: 'middle', backgroundColor: '#274E7B', color: 'white' }}>Estado</th>
                                        <th style={{ paddingTop: '15px', paddingBottom: '15px', verticalAlign: 'middle', backgroundColor: '#274E7B', color: 'white' }}>Total</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentReports.map((reporte) => {
                                        const total = calcularTotalReporte(reporte.detalles);
                                        const isExpanded = expandedRow === reporte.id_reporteprenda;
                                        const rowClass = reporte.estado === 'Activo' ? 'table-success' : 'table-danger';

                                        return (
                                            <React.Fragment key={reporte.id_reporteprenda}>
                                                <tr className={rowClass}>
                                                    <td className="text-center">
                                                        <Button variant="link" size="sm" onClick={() => toggleRow(reporte.id_reporteprenda)}>
                                                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                                        </Button>
                                                    </td>
                                                    <td>{reporte.id_reporteprenda}</td>
                                                    <td>{reporte.alumno?.NombreAlumno}</td>
                                                    <td>
                                                        <Badge bg={reporte.estado === 'Activo' ? 'success' : 'danger'}>
                                                            {reporte.estado}
                                                        </Badge>
                                                    </td>
                                                    <td>${total.toFixed(2)}</td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr>
                                                        <td colSpan="5">
                                                            <Table bordered size="sm" responsive className="mb-0">
                                                                <thead className="table-light">
                                                                    <tr>
                                                                        <th>Artículo</th>
                                                                        <th>Talla</th>
                                                                        <th>Cantidad</th>
                                                                        <th>Precio</th>
                                                                        <th>Total</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {reporte.detalles.map((detalle, idx) => (
                                                                        <tr key={idx}>
                                                                            <td>{detalle.prenda?.nombre_prenda?.trim()}</td>
                                                                            <td>{detalle.talla}</td>
                                                                            <td>{detalle.cantidad}</td>
                                                                            <td>${parseFloat(detalle.precio).toFixed(2)}</td>
                                                                            <td>${(parseFloat(detalle.precio) * detalle.cantidad).toFixed(2)}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </Table>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </Table>

                            <Row className="mt-4">
                                <Col md={{ span: 6, offset: 3 }}>
                                    <Table bordered size="sm">
                                        <tbody>
                                            <tr>
                                                <td><strong>Total Reportes Activos</strong></td>
                                                <td><Badge bg="success">${totalActivos.toFixed(2)}</Badge></td>
                                            </tr>
                                            <tr>
                                                <td><strong>Total Reportes Eliminados</strong></td>
                                                <td><Badge bg="danger">${totalEliminados.toFixed(2)}</Badge></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            {renderPagination()}
                        </>
                    )}
                </Card.Body>
            </Card>
            
        </Container>
    );
}

export default HistoricoReportesInv;
