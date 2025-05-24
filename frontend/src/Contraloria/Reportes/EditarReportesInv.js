import React, { useState, useEffect } from 'react';
import {
    Container, Button, Table, Form, Row, Col, Modal, Card, Spinner, Pagination, InputGroup
} from 'react-bootstrap';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const URI = 'http://localhost:3001/api/reportesPrenda';  

function EditarReportesInv() {
    //Expandir Columnas
    const [expandedRows, setExpandedRows] = useState([]);
    //Alternar Columnas
    const toggleDetails = (id) => {
        setExpandedRows((prev) =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const [reportData, setReportData] = useState([]);
    const [formData, setFormData] = useState({
        id_reporteprenda: '',
        Nombre_Alumno: '',
        semestre: '',
        articulos: [],
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
                console.log('Respuesta del servidor:', response.data);

                // Aseguramos que reportData sea un array, si no, ponemos un array vacío
                const dataArray = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data.data)
                        ? response.data.data
                        : [];

                setReportData(dataArray);
            } catch (err) {
                setError('Hubo un error al cargar los reportes');
            } finally {
                setLoading(false);
            }
        };

        fetchReportes();
    }, []);


    const handleEdit = (report) => {
        setSelectedReport(report.id_reporteprenda);
        setFormData({
            id_reporteprenda: report.id_reporteprenda,
            Nombre_Alumno: report.alumno?.NombreAlumno || `Alumno ${report.id_alumno || ''}`,
            semestre: report.semestre || '',
            articulos: report.detalles?.map((art) => ({
                ...art,
                nombre_prenda: art.prenda?.nombre_prenda || ''
            })) || [],
        });
        setShowModal(true);
    };



    const handleSave = async () => {
        const { id_reporteprenda, semestre, articulos } = formData;

        const payload = {
            id_reporteprenda,
            semestre,
            articulos: articulos.map((art) => ({
                id_detalleprenda: art.id_detalleprenda,
                nombreArticulo: art.nombre_prenda, // <-- ajustamos el nombre
                talla: art.talla,
                precio: Number(art.precio),
                cantidad: Number(art.cantidad),
            })),
        };

        const hasInvalidArticulo = payload.articulos.some(
            (art) =>
                !art.nombreArticulo ||
                !art.talla ||
                Number(art.precio) <= 0 ||
                Number(art.cantidad) <= 0
        );

        if (hasInvalidArticulo) {
            alert("Revisa que todos los artículos tengan nombre, talla, precio y cantidad válidos.");
            return;
        }

        try {
            await axios.put(`${URI}/${formData.id_reporteprenda}`, payload);
            setShowModal(false);
            setSelectedReport(null);
            const response = await axios.get(URI);
            setReportData(response.data.data || response.data || []);
        } catch (err) {
            console.error('Error al guardar el reporte:', err);
            alert("Hubo un error al actualizar el reporte. Revisa la consola.");
        }
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            await axios.put(`${URI}/eliminar/${deleteId}`);
            setReportData((prev) => prev.filter((report) => report.id_reporteprenda !== deleteId));
            setShowConfirm(false);
        } catch (err) {
            console.error('Error al eliminar el reporte:', err);
        }
    };

    const handleArticuloChange = (e, idx) => {
        const { name, value } = e.target;
        const nuevosArticulos = [...formData.articulos];
        nuevosArticulos[idx][name] = value;
        setFormData({ ...formData, articulos: nuevosArticulos });
    };


    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleRemoveArticulo = (idx) => {
        const nuevosArticulos = [...formData.articulos];
        nuevosArticulos.splice(idx, 1);
        setFormData({ ...formData, articulos: nuevosArticulos });
    };


    const filteredData = (reportData || []).filter((report) =>
        (report.alumno?.NombreAlumno || '').toLowerCase().includes(searchTerm.toLowerCase())
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
                                                <th style={{ backgroundColor: '#0d6efd', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Detalles</th>
                                                <th style={{ backgroundColor: '#0d6efd', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Nombre del Alumno</th>
                                                <th style={{ backgroundColor: '#0d6efd', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Semestre</th>
                                                <th style={{ backgroundColor: '#0d6efd', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedData.map((report) => (
                                                <React.Fragment key={report.id_reporteprenda}>
                                                    <tr>
                                                        <td className="text-center">
                                                            <Button
                                                                variant="info"
                                                                size="sm"
                                                                onClick={() => toggleDetails(report.id_reporteprenda)}
                                                            >
                                                                {expandedRows.includes(report.id_reporteprenda) ? "Ocultar" : "Ver"}
                                                            </Button>
                                                        </td>
                                                        <td>{report.alumno?.NombreAlumno || '—'}</td>
                                                        <td>{report.semestre || '—'}</td>
                                                        <td className="text-center">
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                onClick={() => handleEdit(report)}
                                                                className="me-2"
                                                            >
                                                                <FaEdit className="me-1" /> Editar
                                                            </Button>
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={() => confirmDelete(report.id_reporteprenda)}
                                                            >
                                                                <FaTrashAlt className="me-1" /> Eliminar
                                                            </Button>
                                                        </td>
                                                    </tr>

                                                    {expandedRows.includes(report.id_reporteprenda) && (
                                                        <tr>
                                                            <td colSpan="4">
                                                                <Table size="sm" bordered>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Artículo</th>
                                                                            <th>Talla</th>
                                                                            <th>Precio</th>
                                                                            <th>Cantidad</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {report.detalles?.map((item, idx) => (
                                                                            <tr key={idx}>
                                                                                <td>{item.prenda.nombre_prenda || '—'}</td>
                                                                                <td>{item.talla || '—'}</td>
                                                                                <td>${Number(item.precio).toFixed(2)}</td>
                                                                                <td>{item.cantidad}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </Table>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </Table>

                            {renderPagination()}
                        </>
                    )}
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton style={{ backgroundColor: '#003366', color: 'white' }}>
                    <Modal.Title>Editar Reporte</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {formData.articulos?.map((articulo, idx) => (
                        <Row key={idx} className="mb-3">
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label>Artículo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombre_prenda"
                                        value={articulo.nombre_prenda || ''}
                                        onChange={(e) => handleArticuloChange(e, idx)}
                                    />

                                </Form.Group>
                            </Col>
                            <Col sm={2}>
                                <Form.Group>
                                    <Form.Label>Talla</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="talla"
                                        value={articulo.talla || ''}
                                        onChange={(e) => handleArticuloChange(e, idx)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={2}>
                                <Form.Group>
                                    <Form.Label>Precio</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="precio"
                                        min="0"
                                        step="1"
                                        value={articulo.precio || ''}
                                        onChange={(e) => handleArticuloChange(e, idx)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={2}>
                                <Form.Group>
                                    <Form.Label>Cantidad</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="cantidad"
                                        min="0"
                                        value={articulo.cantidad || ''}
                                        onChange={(e) => handleArticuloChange(e, idx)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={12} className="text-end">
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleRemoveArticulo(idx)}
                                >
                                    <FaTrashAlt className="me-1" /> Eliminar artículo
                                </Button>
                            </Col>

                        </Row>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#003366', color: 'white' }}>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas eliminar este reporte?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
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
