import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Container, Button, Table, Form, Row, Col, Modal, Card, Spinner, Pagination, InputGroup } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';

//URI Local
const URI = 'http://localhost:3001/api/reportesPrenda';  

function EditarReportesInv() {
    //Expandir Columnas
    const [expandedRows, setExpandedRows] = useState([]);
    //Alternar Columnas
    const toggleDetails = (id) => {
        setExpandedRows(prev => (prev === id ? null : id));
    };
    //Formato del reporte
    const [reportData, setReportData] = useState([]);
    const [formData, setFormData] = useState({
        id_reporteprenda: '',
        Nombre_Alumno: '',
        semestre: '',
        articulos: [],
    });
    //Reporte seleccionado
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    //ID para eliminar un reporte
    const [deleteId, setDeleteId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //Busqueda de reportes por nombre del alumno
    const [searchTerm, setSearchTerm] = useState('');
    //Paginacion e items por paginacion
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    //Obtener datos de conceptos
    const [conceptos, setConceptos] = useState([]);

    //Advertencia de eliminar todos los articulos
    const [showAdvertencia, setShowAdvertencia] = useState(false);


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

        const fetchConceptos = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/conceptosP');
                setConceptos(response.data);
                console.log(response.data);
            } catch (error) {
                toast.error('Error al obtener los conceptos.');
            }
        };
        fetchConceptos();
        fetchReportes();
    }, []);

    //Guarda los cambios hechos de un reporte en formData 
    const handleEdit = (report) => {
        setSelectedReport(report.id_reporteprenda);

        const articulosConDatos = report.detalles?.map((art) => {
            const nombrePrenda = art.prenda?.nombre_prenda?.trim() || '';
            const tallaActual = art.talla;

            // Filtra tallas disponibles del artículo según los conceptos y unidades > 0
            const tallas = conceptos.filter(
                c => c.nombre_prenda.trim() === nombrePrenda && c.unidades > 0
            );

            // Busca si la talla asignada aún está disponible
            const tallaSeleccionada = tallas.find(t => t.talla === tallaActual);

            return {
                ...art,
                nombre_prenda: nombrePrenda,
                tallasDisponibles: tallas,
                precio: tallaSeleccionada?.precio || art.precio || '',
                cantidadMaxima: tallaSeleccionada?.unidades || null,
            };
        }) || [];

        setFormData({
            id_reporteprenda: report.id_reporteprenda,
            Nombre_Alumno: report.alumno?.NombreAlumno || `Alumno ${report.id_alumno || ''}`,
            semestre: report.semestre || '',
            articulos: articulosConDatos,
        });

        setShowModal(true);
    };


    //Guarda el reporte editado en la base de datos
    const handleSave = async () => {
        const { id_reporteprenda, semestre, articulos } = formData;
        const payload = {
            id_reporteprenda,
            semestre,
            articulos: articulos.map((art) => ({
                id_detalleprenda: art.id_detalleprenda,
                nombreArticulo: art.nombre_prenda,
                talla: art.talla,
                precio: Number(art.precio),
                cantidad: Number(art.cantidad),
            })),
        };

        //Obtiene los articulos  invalidos, es decir, si no hay existencia
        const hasInvalidArticulo = payload.articulos.some(
            (art) =>
                !art.nombreArticulo ||
                !art.talla ||
                Number(art.precio) <= 0 ||
                Number(art.cantidad) <= 0
        );

        //Valida que todos los campos sean correctamente llenados
        if (hasInvalidArticulo) {
            toast.error('Revisa que todos los campos sean válidos.');
            return;
        }

        //Conexion a la base de datos para su guardado
        try {
            await axios.put(`${URI}/${formData.id_reporteprenda}`, payload);
            setShowModal(false);
            setSelectedReport(null);
            const response = await axios.get(URI);
            setReportData(response.data.data || response.data || []);
            toast.success('Reporte actualizado con éxito.')
        } catch (err) {
            console.error('Error al guardar el reporte:', err);
            toast.error('Error al actualizar el reporte.');
        }
    };

    //Confirmacion de eliminacion y cierre de modal
    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    //Elimina el reporte de la base de datos
    const handleDeleteConfirmed = async () => {
        try {
            await axios.put(`${URI}/eliminar/${deleteId}`);
            setReportData((prev) => prev.filter((report) => report.id_reporteprenda !== deleteId));
            setShowConfirm(false);
            toast.success('Reporte eliminado correctamente.')
        } catch (err) {
            console.error('Error al eliminar el reporte:', err);
        }
    };

    const handleArticuloChange = (e, idx) => {
        const { name, value } = e.target;
        const nuevosArticulos = [...formData.articulos];
        const articulo = nuevosArticulos[idx];

        // Actualiza el campo directamente
        articulo[name] = value;

        // Si cambia el nombre del artículo
        if (name === 'nombre_prenda') {
            const articuloSeleccionado = value.trim();
            const tallas = conceptos.filter(
                c => c.nombre_prenda.trim() === articuloSeleccionado && c.unidades > 0
            );

            nuevosArticulos[idx] = {
                ...articulo,
                nombre_prenda: value,
                talla: '',
                precio: '',
                cantidad: '',
                cantidadMaxima: null,
                tallasDisponibles: tallas
            };
        }

        // Si cambia la talla
        if (name === 'talla') {
            const tallasDisponibles = articulo.tallasDisponibles || [];
            const conceptoSeleccionado = tallasDisponibles.find(c => c.talla === value);
            if (conceptoSeleccionado) {
                nuevosArticulos[idx] = {
                    ...articulo,
                    talla: value,
                    precio: conceptoSeleccionado.precio,
                    cantidadMaxima: conceptoSeleccionado.unidades,
                };
            }
        }

        // Si cambia la cantidad
        if (name === 'cantidad') {
            const cantidadIngresada = parseInt(value, 10);
            const cantidadMaxima = articulo.cantidadMaxima || 0;

            if (cantidadMaxima && cantidadIngresada > cantidadMaxima) {
                toast.warning(`Solo hay ${cantidadMaxima} piezas disponibles`);
                nuevosArticulos[idx].cantidad = cantidadMaxima;
            } else {
                nuevosArticulos[idx].cantidad = cantidadIngresada;
            }
        }

        setFormData({ ...formData, articulos: nuevosArticulos });
    };

    //busca el reporte del alumno cuando se utiliza el filtro de buscar
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    //Eliminacion de un articulo de un reporte
    const handleRemoveArticulo = (idx) => {
        if (formData.articulos.length === 1) {
            // No se puede eliminar el último artículo
            setShowAdvertencia(true);
            return;
        }

        const nuevosArticulos = [...formData.articulos];
        nuevosArticulos.splice(idx, 1);
        setFormData({ ...formData, articulos: nuevosArticulos });
    };


    //Filtra los datos de los reportes obtenidos segun la busqueda
    const filteredData = (reportData || []).filter((report) =>
        (report.alumno?.NombreAlumno || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    //Calcula el total de reportes filtrados por paginacion
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                        <FaEdit className="me-2" /> Editar Reportes de Inventario
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
                                                <th style={{ backgroundColor: '#0d6efd', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>No. Folio</th>
                                                <th style={{ backgroundColor: '#0d6efd', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Nombre del Alumno</th>
                                                <th style={{ backgroundColor: '#0d6efd', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Semestre</th>
                                                <th style={{ backgroundColor: '#0d6efd', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedData.map((report) => {
                                                const isExpanded = expandedRows === report.id_reporteprenda;
                                                return (
                                                    <React.Fragment key={report.id_reporteprenda}>
                                                        <tr>
                                                            <td className="text-center">
                                                                <Button
                                                                    variant="info"
                                                                    size="sm"
                                                                    onClick={() => toggleDetails(report.id_reporteprenda)}
                                                                >
                                                                    {expandedRows === report.id_reporteprenda ? (
                                                                        <>
                                                                            <FaChevronUp /> Ocultar
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <FaChevronDown /> Ver
                                                                        </>
                                                                    )}
                                                                </Button>

                                                            </td>
                                                            <td>00{report.id_reporteprenda}</td>
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
                                                        {/* Renglones expandiles con detalle de reportes */}
                                                        {expandedRows === report.id_reporteprenda && (
                                                            <tr>
                                                                <td colSpan="5">
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
                                                                            {/* Mapeo de los detalles de reporte por ID */}
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
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                            {renderPagination()}
                        </>
                    )}
                </Card.Body>
            </Card>

            {/* Modal para editar un reporte */}
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
                                        as="select"
                                        name="nombre_prenda"
                                        value={articulo.nombre_prenda?.trim() || ''}
                                        onChange={(e) => handleArticuloChange(e, idx)}
                                    >

                                        <option value="">Selecciona una prenda</option>
                                        {[...new Set(conceptos.map(c => c.nombre_prenda.trim()))].map((nombre, i) => (
                                            <option key={i} value={nombre}>{nombre}</option>
                                        ))}

                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            <Col sm={2}>
                                <Form.Group>
                                    <Form.Label>Talla</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="talla"
                                        value={articulo.talla?.trim() || ''}
                                        onChange={(e) => handleArticuloChange(e, idx)}
                                        disabled={!articulo.tallasDisponibles || articulo.tallasDisponibles.length === 0}
                                    >

                                        <option value="">Selecciona la talla</option>
                                        {articulo.tallasDisponibles?.map((c, i) => (
                                            <option key={i} value={c.talla}>
                                                {c.talla} ({c.unidades} disponibles)
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            <Col sm={2}>
                                <Form.Group>
                                    <Form.Label>Precio</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="precio"
                                        value={articulo.precio || ''}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col sm={2}>
                                <Form.Group>
                                    <Form.Label>Cantidad</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="cantidad"
                                        min="1"
                                        max={articulo.cantidadMaxima || 1}
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

            {/* Modal de confirmacion de eliminacion de reporte */}
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

            {/* Modal de advertencia de eliminacion de productos */}
            {/* Modal de advertencia: no eliminar todos los artículos */}
            <Modal show={showAdvertencia} onHide={() => setShowAdvertencia(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#ffc107' }}>
                    <Modal.Title>Advertencia</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <strong>No se pueden eliminar todos los artículos.</strong><br />
                    Si necesitas eliminar todo el reporte, contacta a un Administrador.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" onClick={() => setShowAdvertencia(false)}>
                        Entendido
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
}

export default EditarReportesInv;