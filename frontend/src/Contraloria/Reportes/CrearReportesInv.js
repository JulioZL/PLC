import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Card, InputGroup } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { PlusCircle, Save } from 'react-bootstrap-icons';


function CrearReportesInv() {
    const [reportData, setReportData] = useState([]);
    const [formData, setFormData] = useState({
        IDreporte: Date.now().toString(),
        nombreAlumno: '',
        Semestre: '',
        nombreArticulo: '',
        talla: '',
        precio: '',
        cantidad: '',
        lugar: 'Yuriria, GTO.',
        fecha: new Date().toLocaleDateString(),
    });
    const [filteredAlumnos, setFilteredAlumnos] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [activeIndex, setActiveIndex] = React.useState(-1);
    const [showAutocomplete, setShowAutocomplete] = React.useState(false);
    const listItemRefs = useRef([]);
    const validateArticleFields = () => {
        const { nombreArticulo, talla, precio, cantidad } = formData;
        if (!nombreArticulo.trim()) return toast.error('El nombre del artículo es obligatorio.');
        if (!talla.trim()) return toast.error('La talla es obligatoria.');
        if (!precio || isNaN(precio) || precio <= 0) return toast.error('El precio debe ser un número mayor a 0.');
        if (!cantidad || isNaN(cantidad) || cantidad <= 0) return toast.error('La cantidad debe ser un número mayor a 0.');
        return true;
    };

    const [conceptos, setConceptos] = useState([]);

    useEffect(() => {
        const fetchConceptos = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/conceptosP');
                setConceptos(response.data);
            } catch (error) {
                toast.error('Error al obtener los conceptos.');
            }
        };
        fetchConceptos();

        if (activeIndex >= 0 && listItemRefs.current[activeIndex]) {
            listItemRefs.current[activeIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [activeIndex]);

    const validateReportFields = () => {
        if (!formData.nombreAlumno.trim()) return toast.error('El nombre del alumno es obligatorio.');
        if (!formData.Semestre.trim()) return toast.error('El Semestre es obligatorio.');
        if (reportData.length === 0) return toast.error('Debes agregar al menos un artículo al reporte.');
        return true;
    };

    const resetForm = () => {
        setFormData({
            IDreporte: Date.now().toString(),
            nombreAlumno: '',
            nombreArticulo: '',
            talla: '',
            precio: '',
            cantidad: '',
            Semestre: '',
            lugar: 'Yuriria, GTO.',
            fecha: new Date().toLocaleDateString(),
        });
        setReportData([]);
    };

    const handleSaveReport = async () => {
        if (!validateReportFields()) return;

        const payload = reportData.map(item => ({
            Nombre_Alumno: formData.nombreAlumno,
            Nombre_Articulo: item.nombreArticulo,
            Talla: item.talla,
            Precio: item.precio,
            Cantidad: item.cantidad,
            Semestre: formData.Semestre,
        }));

        try {
            const response = await axios.post('http://localhost:3001/api/reportesPrenda', payload);
            if (response.status === 200) {
                toast.success('Reporte guardado correctamente.');
                resetForm();
            } else {
                toast.error('Error al guardar el reporte.');
            }
        } catch (error) {
            console.error('Error al guardar el reporte:', error);
            toast.error('Ocurrió un error al intentar guardar el reporte.');
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'nombreAlumno' && value.trim().length >= 3) {
            try {
                const response = await axios.get('http://localhost:3001/api/alumnos', { params: { NombreAlumno: value } });
                setFilteredAlumnos(response.data);
            } catch (error) {
                console.error('Error al buscar alumnos:', error);
                toast.error('Error al buscar alumnos.');
                setFilteredAlumnos([]);
            }
        } else if (name === 'nombreAlumno') {
            setFilteredAlumnos([]);
        }

        if (name === 'nombreArticulo') {
            const selectedConcepto = conceptos.find(concepto => concepto.nombre_prenda === value);
            if (selectedConcepto) {
                setFormData({
                    ...formData,
                    nombreArticulo: value,
                    precio: selectedConcepto.precio, // <- esta es la clave correcta
                });
            } else {
                setFormData({
                    ...formData,
                    nombreArticulo: value,
                    precio: '', // borra precio si el artículo no se encuentra
                });
            }
        }


    };


    const handleSelectAlumno = (alumno) => {
        setFormData({
            ...formData,
            nombreAlumno: alumno.NombreAlumno
        });
        setFilteredAlumnos([]);
    };

    const handleAddArticle = () => {
        if (!validateArticleFields()) return;

        const newArticle = {
            nombreArticulo: formData.nombreArticulo,
            talla: formData.talla,
            precio: parseFloat(formData.precio),
            cantidad: parseInt(formData.cantidad),
            subtotal: parseFloat(formData.precio) * parseInt(formData.cantidad),
        };

        setReportData([...reportData, newArticle]);
        setFormData({
            ...formData,
            nombreArticulo: '',
            talla: '',
            precio: '',
            cantidad: '',
        });
        toast.success('Artículo agregado correctamente.');
    };

    const handleKeyDown = (e) => {
        if (!filteredAlumnos.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (prev + 1) % filteredAlumnos.length);
            setShowAutocomplete(true);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (prev - 1 + filteredAlumnos.length) % filteredAlumnos.length);
            setShowAutocomplete(true);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && activeIndex < filteredAlumnos.length) {
                handleSelectAlumno(filteredAlumnos[activeIndex]);
                setShowAutocomplete(false);
                setActiveIndex(-1);
            }
        } else if (e.key === 'Escape') {
            setShowAutocomplete(false);
            setActiveIndex(-1);
        }
    };

    const calculateTotal = () =>
        reportData.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2);

    return (
        <Container className="py-4">
            <ToastContainer />
            <Card className="shadow mb-4">
                <Card.Body>
                    <h4 className="text-center mb-4">Generador de Reportes - Inventario</h4>
                    <Form>
                        <Row className="mb-3">
                            
                            <Col xs={12} md={6} className="position-relative">
                                <Form.Label>Nombre del Alumno</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombreAlumno"
                                    value={formData.nombreAlumno}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setShowAutocomplete(true);
                                        setActiveIndex(-1);
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ingresa el nombre del alumno"
                                    autoComplete="off"
                                />

                                {showAutocomplete && (
                                    <ul
                                        style={{
                                            position: 'absolute',
                                            zIndex: 1000,
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            maxHeight: '220px',
                                            overflowY: 'auto',
                                            margin: 0,
                                            padding: 0,
                                            backgroundColor: '#fff',
                                            border: '1px solid #ccc',
                                            borderRadius: '0.5rem',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            listStyle: 'none',
                                        }}
                                    >
                                        {filteredAlumnos.length > 0 ? (
                                            filteredAlumnos.map((alumno, index) => (
                                                <li
                                                    ref={(el) => (listItemRefs.current[index] = el)}
                                                    key={alumno.id_alumno}
                                                    onClick={() => {
                                                        handleSelectAlumno(alumno);
                                                        setShowAutocomplete(false);
                                                        setActiveIndex(-1);
                                                    }}
                                                    style={{
                                                        padding: '10px 15px',
                                                        cursor: 'pointer',
                                                        backgroundColor: index === activeIndex ? '#007bff' : 'transparent',
                                                        color: index === activeIndex ? '#fff' : '#000',
                                                        fontWeight: index === activeIndex ? 'bold' : 'normal',
                                                        transition: 'background-color 0.2s ease',
                                                    }}
                                                >
                                                    {alumno.NombreAlumno}
                                                </li>
                                            ))
                                        ) : (
                                            <li
                                                style={{
                                                    padding: '10px 15px',
                                                    color: '#888',
                                                }}
                                            >
                                                No se encontraron coincidencias
                                            </li>
                                        )}
                                    </ul>

                                )}
                            </Col>

                            <Col xs={12} md={6}>
                                <Form.Label>Semestre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Semestre"
                                    value={formData.Semestre}
                                    onChange={handleChange}
                                    placeholder="Ej. 4to"
                                />
                            </Col>
                        </Row>

                        <h5 className="my-3">Agregar Artículos</h5>
                        <Row className="mb-3">

                            <Col xs={12} md={6} lg={4}>
                                <Form.Label>Nombre del Artículo</Form.Label>

                                <Form.Control
                                    as="select"
                                    name="nombreArticulo"
                                    value={formData.nombreArticulo}
                                    onChange={handleChange}
                                >
                                    <option value="">Selecciona una Prenda</option>
                                    {conceptos.map((concepto) => (
                                        <option
                                            key={concepto.id_prenda}
                                            value={concepto.nombre_prenda}
                                        >
                                            {concepto.nombre_prenda}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Col>
                            <Col sm={6}>
                                <Form.Label>Articulo</Form.Label>
                                <Form.Select aria-label="Default select example">
                                    <option>Open this select menu</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </Form.Select>
                            </Col>
                            <Col xs={6} md={3} lg={2}>
                                <Form.Label>Talla</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="talla"
                                    value={formData.talla}
                                    onChange={handleChange}

                                    placeholder="M, L, XL"
                                />

                                    <option value="">Selecciona la talla</option>
                                    {[14, 16, 18, 28, 30, 32, 34, 36, 38, 40, 42, 44, 'CH','M', 'G', 'XL','UT'].map(tall => <option key={tall} value={tall}>{tall}</option>)}

                            </Col>
                            <Col xs={6} md={3} lg={2}>
                                <Form.Label>Precio</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    name="precio"
                                    value={formData.precio}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                />
                            </Col>
                            <Col xs={6} md={3} lg={2}>
                                <Form.Label>Cantidad</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    step="1"
                                    name="cantidad"
                                    value={formData.cantidad}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                            </Col>
                            <Col xs={6} md={3} lg={2} className="d-flex align-items-end">
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id="tooltip-agregar">Agregar artículo al reporte</Tooltip>}
                                >
                                    <Button variant="primary" onClick={handleAddArticle}>
                                        <PlusCircle className="me-1" />
                                        Agregar
                                    </Button>
                                </OverlayTrigger>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            <Card.Body>
                <Card.Title>Artículos en el Reporte</Card.Title>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Talla</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id="tooltip-subtotal">Precio × Cantidad</Tooltip>}
                                >
                                    <span>Subtotal</span>
                                </OverlayTrigger>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center text-muted">
                                    No hay artículos agregados al reporte.
                                </td>
                            </tr>
                        ) : (
                            <>
                                {reportData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.nombreArticulo}</td>
                                        <td>{item.talla}</td>
                                        <td>${item.precio.toFixed(2)}</td>
                                        <td>{item.cantidad}</td>
                                        <td>${item.subtotal.toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan="4" className="text-end"><strong>Total</strong></td>
                                    <td><strong>${calculateTotal()}</strong></td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </Table>
            </Card.Body>


            <Button variant="success" className="w-100" onClick={() => setShowConfirmModal(true)}>
                <Save className="me-2" />
                Guardar y Exportar Reporte
            </Button>
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#003366', color: 'white' }}>
                    <Modal.Title>Confirmar Guardado</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Estás seguro de que deseas guardar este reporte de inventario?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowConfirmModal(false)}>Cancelar</Button>
                    <Button variant="success" onClick={() => { handleSaveReport(); setShowConfirmModal(false); }}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>

    );
}

export default CrearReportesInv;
