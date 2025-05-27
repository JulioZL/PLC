import axios from 'axios';
import React, { useState, useEffect, useRef } from "react";
import {
    Container,
    Card,
    Form,
    Row,
    Col,
    Button,
    Table,
    OverlayTrigger,
    Tooltip,
    ToastContainer,
    Modal,
} from "react-bootstrap";
import { PlusCircle, Save } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import ExportPDFReportes from './ExportPDFReportes.js';

function CrearReportesSEM() {
    const [formData, setFormData] = useState({
        Nombre_Alumno: "",
        Semestre: "",
        Concepto: "",
        Mes_de_Pago: "",
        Ciclo_Escolar: "",
        Precio: "",
        Cantidad: "",
        Fecha: new Date().toLocaleDateString(), // fecha fija arriba
    });
    const cicloEscolarOptions = ["Enero - Junio", "Agosto - Diciembre"];
    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
    ];

    const [activeIndex, setActiveIndex] = React.useState(-1);
    const [showAutocomplete, setShowAutocomplete] = React.useState(false);


    const resetForm = () => {
        setFormData({
            Nombre_Alumno: '',
            Semestre: '',
            Grupo: '',
            Concepto: '',
            Precio: '',
            Cantidad: '',
            Total: '',
            Mes_de_Pago: '',
            Ciclo_Escolar: '',
            Lugar: 'Yuriria, GTO.',
            Fecha: new Date().toLocaleDateString(),
        });
    };
    const [reportData, setReportData] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const listItemRefs = useRef([]);
    const [alumnos, setAlumnos] = useState([]);
    const [filteredAlumnos, setFilteredAlumnos] = useState([]);
    const [conceptos, setConceptos] = useState([]);

    useEffect(() => {
        if (activeIndex >= 0 && listItemRefs.current[activeIndex]) {
            listItemRefs.current[activeIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }

        const fetchConceptos = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/conceptos');
                setConceptos(response.data);
            } catch (error) {
                toast.error('Error al obtener los conceptos.');
            }
        };
        fetchConceptos();
    }, [activeIndex]);

    const validateForm = () => {
        const {
            Nombre_Alumno,
            Semestre,
            Concepto,
            Precio,
            Cantidad,
            Mes_de_Pago,
            Ciclo_Escolar,
        } = formData;

        if (!Nombre_Alumno || !Semestre || !Concepto || !Precio || !Cantidad || !Mes_de_Pago || !Ciclo_Escolar) {
            toast.warning('Todos los campos son obligatorios.');
            return false;
        }
        if (Cantidad <= 0 || Precio <= 0) {
            toast.warning('Cantidad y Precio deben ser mayores a cero.');
            return false;
        }
        return true;
    };

    const handleSaveReport = async () => {
        if (reportData.length === 0) {
            toast.warning('No hay reportes para guardar.');
            return;
        }
        const reportToSave = reportData[0];
        try {
            const response = await axios.post('http://localhost:3001/api/reportes', reportToSave);
            if (response.status === 200) {
                setReportData([]);
                resetForm();
            }
        } catch (error) {
            toast.error('Error al guardar el reporte.');
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'Nombre_Alumno' && value.length >= 3) {
            try {
                const response = await axios.get(`http://localhost:3001/api/alumnos`, {
                    params: { NombreAlumno: value }
                });
                setFilteredAlumnos(response.data);
            } catch (error) {
                setFilteredAlumnos([]);
                toast.error('Error al buscar alumnos.');
            }
        } else if (name === 'Nombre_Alumno') {
            setFilteredAlumnos([]);
        }

        if (name === 'Concepto') {
            const selectedConcepto = conceptos.find(concepto => concepto.nombreConcepto === value);
            if (selectedConcepto) {
                setFormData({
                    ...formData,
                    Concepto: value,
                    Precio: selectedConcepto.precio,
                });
            }
        }
    };

    const handleSelectAlumno = (alumno) => {
        setFormData({
            ...formData,
            Nombre_Alumno: alumno.NombreAlumno
        });
        setFilteredAlumnos([]);
    };

    const validateFields = () => {
        if (!formData.Nombre_Alumno || !formData.Semestre) {
            toast.error("Por favor, selecciona el alumno y semestre.");
            return false;
        }
        if (!formData.Concepto) {
            toast.error("Selecciona un concepto.");
            return false;
        }
        if (formData.Concepto === "Colegiatura mensual" && !formData.Mes_de_Pago) {
            toast.error("Selecciona el mes de pago para Colegiatura Mensual.");
            return false;
        }
        if (!formData.Precio || isNaN(formData.Precio) || formData.Precio <= 0) {
            toast.error("Ingresa un precio válido.");
            return false;
        }
        if (!formData.Cantidad || isNaN(formData.Cantidad) || formData.Cantidad <= 0) {
            toast.error("Ingresa una cantidad válida.");
            return false;
        }
        return true;
    };

    const handleAddReport = () => {
        if (!validateFields()) return;

        const newConcept = {
            Nombre_Alumno: formData.Nombre_Alumno,
            Semestre: formData.Semestre,
            Concepto: formData.Concepto,
            Mes_de_Pago: formData.Concepto === "Colegiatura mensual" ? formData.Mes_de_Pago : "",
            Ciclo_Escolar: formData.Ciclo_Escolar,
            Precio: parseFloat(formData.Precio),
            Cantidad: parseInt(formData.Cantidad),
            Total: parseFloat(formData.Precio) * parseInt(formData.Cantidad),
            Fecha: formData.Fecha,
        };

        setReportData((prev) => [...prev, newConcept]);

        // Limpia campos de concepto, precio, cantidad, mes de pago y ciclo escolar (sin borrar alumno ni semestre)
        setFormData((prev) => ({
            ...prev,
            Concepto: "",
            Mes_de_Pago: "",
            Ciclo_Escolar: "",
            Precio: "",
            Cantidad: "",
        }));

        toast.success("Concepto agregado correctamente.");
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


    const calculateGrandTotal = () =>
        reportData.reduce((acc, item) => acc + item.Total, 0).toFixed(2);

    return (
        <Container className="py-4">
            <ToastContainer />
            <Card className="shadow mb-4">
                <Card.Body>
                    <h4 className="text-center mb-4">Generación de Reportes Semestrales</h4>

                    <Form>
                        <Row className="mb-3">
                            <Col xs={12} md={6} className="position-relative">
                                <Form.Label>Nombre del Alumno</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Nombre_Alumno"
                                    value={formData.Nombre_Alumno}
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

                        <h5 className="my-3">Agregar Conceptos de Pago</h5>
                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <Form.Label>Concepto</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="Concepto"
                                    value={formData.Concepto}
                                    onChange={handleChange}
                                >
                                    <option value="">Selecciona un concepto</option>
                                    {conceptos.map((concepto) => (
                                        <option
                                            key={concepto.idConcepto}
                                            value={concepto.nombreConcepto}
                                        >
                                            {concepto.nombreConcepto}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Col>

<<<<<<< HEAD

=======
                            <Col xs={12} md={6}>
                                <Form.Label>Mes de Pago</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="Mes_de_Pago"
                                    value={formData.Mes_de_Pago}
                                    onChange={handleChange}
                                    disabled={formData.Concepto !== "Colegiatura mensual"}
                                >
                                    <option value="">Selecciona el mes</option>
                                    {months.map((month, index) => (
                                        <option key={index} value={month}>
                                            {month}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Col>
                        </Row>
>>>>>>> f10bb6aac0f8545f058c2946bfba8801466a64e6
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>Grupo</Form.Label>
                    <Col sm={3}>
                        <Form.Control
                            type="text"
                            name="Grupo"
                            value={formData.Grupo}
                            onChange={handleChange}
                            placeholder="Ingresa el grupo del alumno"

                        />
                    </Col>
                    <Form.Label column sm={1}>Concepto</Form.Label>
                    <Col sm={6}>
                        <Form.Control
                            as="select"
                            name="Concepto"
                            value={formData.Concepto}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona un concepto</option>
                            {conceptos.map((concepto) => (
                                <option key={concepto.idConcepto} value={concepto.nombreConcepto}>
                                    {concepto.nombreConcepto}
                                </option>
                            ))}
                        </Form.Control>
                    </Col>
                </Form.Group>
<<<<<<< HEAD

                            <Col xs={12} md={6}>
                                <Form.Label>Mes de Pago</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="Mes_de_Pago"
                                    value={formData.Mes_de_Pago}
                                    onChange={handleChange}
                                    disabled={formData.Concepto !== "Colegiatura mensual"}
                                >
                                    <option value="">Selecciona el mes</option>
                                    {months.map((month, index) => (
                                        <option key={index} value={month}>
                                            {month}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Col>
                        </Row>
=======
>>>>>>> f10bb6aac0f8545f058c2946bfba8801466a64e6

                        <Row className="mb-3">
                            <Col xs={6} md={3}>
                                <Form.Label>Ciclo Escolar</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="Ciclo_Escolar"
                                    value={formData.Ciclo_Escolar}
                                    onChange={handleChange}
                                >
                                    <option value="">Selecciona el ciclo escolar</option>
                                    {cicloEscolarOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Col>

                            <Col xs={6} md={3}>
                                <Form.Label>Precio</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="Precio"
                                    value={formData.Precio}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                />
                            </Col>

                            <Col xs={6} md={3}>
                                <Form.Label>Cantidad</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="Cantidad"
                                    value={formData.Cantidad}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                            </Col>

                            <Col
                                xs={6}
                                md={3}
                                className="d-flex align-items-end justify-content-end"
                            >
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip id="tooltip-agregar-concepto">
                                            Agregar concepto al reporte
                                        </Tooltip>
                                    }
                                >
                                    <Button variant="primary" onClick={handleAddReport}>
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
                    <Card.Title>Conceptos en el Reporte</Card.Title>
                    <Table striped bordered hover responsive>
                        <thead style={{ backgroundColor: "#0d6efd", color: "white" }}>
                            <tr>
                                <th>Concepto</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                                <th>Mes de Pago</th>
                                <th>Ciclo Escolar</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center text-muted">
                                        No hay conceptos agregados al reporte.
                                    </td>
                                </tr>
                            ) : (
                                reportData.map((report, index) => (
                                    <tr key={index}>
                                        <td>{report.Concepto}</td>
                                        <td>${report.Precio.toFixed(2)}</td>
                                        <td>{report.Cantidad}</td>
                                        <td>${report.Total.toFixed(2)}</td>
                                        <td>{report.Mes_de_Pago}</td>
                                        <td>{report.Ciclo_Escolar}</td>
                                        <td>{report.Fecha}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {reportData.length > 0 && (
                            <tfoot>
                                <tr>
                                    <td colSpan="5" className="text-end fw-bold">
                                        Gran Total
                                    </td>
                                    <td colSpan="4" className="fw-bold">
                                        ${calculateGrandTotal()}
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </Table>

                </Card.Body>
                    <Button
                        variant="success"
                        className="w-100"
                onClick={() => setShowConfirmModal(true)}
                    >
                        <Save className="me-2" />
                        Guardar y Exportar a PDF
            </Button>
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#003366', color: 'white' }}>
                    <Modal.Title>Confirmar Guardado</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Estás seguro de que deseas guardar este reporte de Semestre?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowConfirmModal(false)}>Cancelar</Button>
                    <Button variant="success" onClick={() => { const reportToSave = reportData[0]; ExportPDFReportes(reportToSave); handleSaveReport(); setShowConfirmModal(false); }}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};
export default CrearReportesSEM;
