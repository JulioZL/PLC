import React, { useState, useEffect } from 'react';
import {
    Container, Button, Table, Form, Row, Col, Modal, Card, Spinner, Pagination, InputGroup
} from 'react-bootstrap';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const URI = 'http://localhost:3001/api/reportesPrenda';

function EditarReportesInv() {
    const [reportData, setReportData] = useState([]);
    const [formData, setFormData] = useState({
        Id_ReportePrenda: '',
        Nombre_Alumno: '',
        Semestre: '',
        Nombre_Articulo: '',
        Talla: '',
        Precio: '',
        Cantidad: '',
    });
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        const fetchReportes = async () => {
            try {

                const response = await axios.get(URI);
                setReportData(response.data.data);
            } catch (err) {
                setError('Hubo un error al cargar los reportes');
            } finally {
                setLoading(false);
            }
        };
        fetchReportes();
    }, []);

    const handleEdit = (report) => {
        setSelectedReport(report.Id_ReportePrenda);
        setFormData(report);
        setShowModal(true);
    };

    const handleSave = async () => {
        const { Precio, Cantidad, Nombre_Alumno, Nombre_Articulo, Talla, Semestre } = formData;
        if (!Nombre_Alumno || !Nombre_Articulo || !Talla || !Semestre || Precio <= 0 || Cantidad <= 0) {
            alert('Por favor, completa todos los campos y asegúrate de que Precio y Cantidad sean mayores a 0.');
            return;
        }
        try {

            await axios.put(`${URI}/${formData.Id_ReportePrenda}`, formData);

            setReportData((prev) =>
                prev.map((report) =>
                    report.Id_ReportePrenda === selectedReport ? { ...formData } : report
                )
            );
            setShowModal(false);
            setSelectedReport(null);
        } catch (err) {
            console.error('Error al guardar el reporte:', err);
        }
    };


    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            await axios.put(`${URI}/eliminar/${deleteId}`);
            setReportData((prev) => prev.filter((report) => report.Id_ReportePrenda !== deleteId));
            setShowConfirm(false);
        } catch (err) {
            console.error('Error al eliminar el reporte:', err);
        }
    }
    const handleDelete = (id) => {
        confirmDialog({
            message: '¿Estás seguro de que deseas eliminar este reporte?',
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await axios.put(`http://localhost:3001/api/reportesPrenda/eliminar/${id}`);
                    setReportData((prev) => prev.filter((report) => report.Id_ReportePrenda !== id));
                } catch (err) {
                    console.error('Error al eliminar el reporte:', err);
                }
            },
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredData = reportData.filter((report) =>
        report.Nombre_Alumno.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                    <Card.Title className="text-center mb-4">
                        <h4>Editar Reportes de Inventario</h4>
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
                            <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th style={{ backgroundColor: '#0d6efd', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                                                    Nombre del Alumno
                                                </th>
                                                <th style={{ backgroundColor: '#0d6efd', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                                                    Semestre
                                                </th>
                                                <th style={{ backgroundColor: '#0d6efd', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                                                    Artículo
                                                </th>
                                                <th style={{ backgroundColor: '#0d6efd', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                                                    Talla
                                                </th>
                                                <th style={{ backgroundColor: '#0d6efd', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                                                    Precio
                                                </th>
                                                <th style={{ backgroundColor: '#0d6efd', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                                                    Cantidad
                                                </th>
                                                <th style={{ backgroundColor: '#0d6efd', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>

                                <tbody>
                                    {paginatedData.map((report) => (
                                        <tr key={report.Id_ReportePrenda}>
                                            <td>{report.Nombre_Alumno}</td>
                                            <td>{report.Semestre}</td>
                                            <td>{report.Nombre_Articulo}</td>
                                            <td>{report.Talla}</td>
                                            <td>${Number(report.Precio).toFixed(2)}</td>
                                            <td>{report.Cantidad}</td>
                                            <td className="text-center">
                                                <Button variant="outline-primary" size="sm" onClick={() => handleEdit(report)} className="me-2">
                                                    <FaEdit className="me-1" /> Editar
                                                </Button>
                                                <Button variant="outline-danger" size="sm" onClick={() => confirmDelete(report.Id_ReportePrenda)}>
                                                    <FaTrashAlt className="me-1" /> Eliminar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {renderPagination()}
                        </>
                    )}
                </Card.Body>
            </Card>

            {/* Modal de Edición */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#003366', color: 'white' }}>
                    <Modal.Title>Editar Reporte</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="mb-3">
                            <Col sm={8}>
                                <Form.Group>
                                    <Form.Label>Nombre del Alumno</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Nombre_Alumno"
                                        value={formData.Nombre_Alumno}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={4}>
                                <Form.Group>
                                    <Form.Label>Semestre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Semestre"
                                        value={formData.Semestre}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={8}>
                                <Form.Group>
                                    <Form.Label>Artículo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Nombre_Articulo"
                                        value={formData.Nombre_Articulo}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={4}>
                                <Form.Group>
                                    <Form.Label>Talla</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Talla"
                                        value={formData.Talla}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Precio</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="Precio"
                                        value={formData.Precio}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Cantidad</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="Cantidad"
                                        value={formData.Cantidad}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="success" onClick={handleSave}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Confirmación */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#003366', color: 'white' }}>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas eliminar este reporte?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" onClick={() => setShowConfirm(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirmed}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default EditarReportesInv;