import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Modal, Table } from 'react-bootstrap';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import './EditarReportes.css';
const URI = 'http://localhost:3001/api/reportes/';
function EditarReportes() {
    const [reportData, setReportData] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
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

    const [showModal, setShowModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteReportId, setDeleteReportId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {
        const fetchReportes = async () => {
            try {
<<<<<<< HEAD
<<<<<<< HEAD
                const response = await axios.get(URI);
=======
                const response = await axios.get('https://plc-j41x.onrender.com/api/reportes');
>>>>>>> 888cc4361008ae88dba76e8ed42b74d68c43fdf5
=======
                const response = await axios.get('http://localhost:3001/api/reportes');
>>>>>>> 723b4a623f26293aa3d384ba2508cb7be39e4b32
                setReportData(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Hubo un error al cargar los reportes');
                setLoading(false);
            }
        };

        fetchReportes();
    }, []);

    const getReportes = async () => {
        const res = await axios.get(URI);
    }

    const handleEdit = (report) => {
        setSelectedReport(report.Id_ReporteSemestral);
        setFormData({ ...report });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            await axios.put(`http://localhost:3001/api/reportes/${formData.Id_ReporteSemestral}`, formData);
            setReportData((prev) =>
                prev.map((report) =>
                    report.Id_ReporteSemestral === selectedReport ? { ...formData } : report
                )
            );
            setShowModal(false);
            resetForm();
        } catch (err) {
            console.error('Error al guardar el reporte', err);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        resetForm();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDelete = async () => {
        try {
            await axios.put(`http://localhost:3001/api/reportes/eliminar/${deleteReportId}`);
            setReportData((prev) =>
                prev.filter((report) => report.Id_ReporteSemestral !== deleteReportId)
            );
            setShowDeleteDialog(false);
        } catch (err) {
            console.error('Error al eliminar el reporte', err);
        }
    };

    const confirmDelete = (id) => {
        setDeleteReportId(id);
        setShowDeleteDialog(true);
    };

    const resetForm = () => {
        setFormData({
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
    };

    const validateForm = () => {
        if (!formData.Nombre_Alumno || !formData.Semestre || !formData.Grupo || !formData.Concepto || !formData.Mes_de_Pago || !formData.Ciclo_Escolar) {
            alert('Todos los campos son obligatorios.');
            return false;
        }
        if (formData.Precio <= 0 || formData.Cantidad <= 0) {
            alert('Precio y Cantidad deben ser mayores a 0.');
            return false;
        }
        return true;
    };

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ];

    const cicloEscolarOptions = ['Enero - Junio', 'Agosto - Diciembre'];

    if (loading) return <p>Cargando reportes...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Container className="reportes-container">
            <Table striped bordered hover>
                <thead>
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
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {reportData.map((report) => (
                        <tr key={report.Id_ReporteSemestral}>
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
                            <td>
                                {report.Estado === 'Activo' && (
                                    <>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            onClick={() => handleEdit(report)}
                                        >
                                            Editar
                                        </Button>{' '}
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => confirmDelete(report.Id_ReporteSemestral)}
                                        >
                                            Eliminar
                                        </Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal para Editar */}
            <Modal show={showModal} onHide={handleCancel} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Reporte</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col sm={6}>
                                <Form.Group controlId="Nombre_Alumno">
                                    <Form.Label>Nombre Alumno</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Nombre_Alumno"
                                        value={formData.Nombre_Alumno}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group controlId="Semestre">
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
                        <Row>
                            <Col sm={6}>
                                <Form.Group controlId="Grupo">
                                    <Form.Label>Grupo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Grupo"
                                        value={formData.Grupo}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group controlId="Concepto">
                                    <Form.Label>Concepto</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Concepto"
                                        value={formData.Concepto}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <Form.Group controlId="Precio">
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
                                <Form.Group controlId="Cantidad">
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
                        <Row>
                            <Col sm={6}>
                                <Form.Group controlId="Mes_de_Pago">
                                    <Form.Label>Mes de Pago</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="Mes_de_Pago"
                                        value={formData.Mes_de_Pago}
                                        onChange={handleChange}
                                    >
                                        {months.map((month, index) => (
                                            <option key={index} value={month}>
                                                {month}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group controlId="Ciclo_Escolar">
                                    <Form.Label>Ciclo Escolar</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="Ciclo_Escolar"
                                        value={formData.Ciclo_Escolar}
                                        onChange={handleChange}
                                    >
                                        {cicloEscolarOptions.map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Diálogo de confirmación para eliminar */}
            <Dialog
                visible={showDeleteDialog}
                onHide={() => setShowDeleteDialog(false)}
                header="Confirmar Eliminación"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowDeleteDialog(false)}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Eliminar
                        </Button>
                        }

                    </>
                }
                />
        </Container>
    );
}

export default EditarReportes;
