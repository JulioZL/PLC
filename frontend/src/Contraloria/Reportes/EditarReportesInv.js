import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Form, Row, Col, Modal } from 'react-bootstrap';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import axios from 'axios';

function EditarReportesInv() {
    const [reportData, setReportData] = useState([]);
    const [formData, setFormData] = useState({
        Id_ReportePrenda: '',
        Nombre_Alumno: '',
        Grupo: '',
        Nombre_Articulo: '',
        Talla: '',
        Precio: '',
        Cantidad: '',
    });
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchReportes = async () => {
            try {
                const response = await axios.get('https://plc-j41x.onrender.com/api/reportesPrenda');
                setReportData(response.data.data);
            } catch (err) {
                console.error('Error al cargar reportes:', err);
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
        const { Precio, Cantidad, Nombre_Alumno, Nombre_Articulo, Talla, Grupo } = formData;
        if (!Nombre_Alumno || !Nombre_Articulo || !Talla || !Grupo || Precio <= 0 || Cantidad <= 0) {
            alert('Por favor, completa todos los campos y asegúrate de que Precio y Cantidad sean mayores a 0.');
            return;
        }
        try {
            await axios.put(`https://plc-j41x.onrender.com/api/reportesPrenda/${formData.Id_ReportePrenda}`, formData);
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

    const handleDelete = (id) => {
        confirmDialog({
            message: '¿Estás seguro de que deseas eliminar este reporte?',
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await axios.put(`https://plc-j41x.onrender.com/api/reportesPrenda/eliminar/${id}`);
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

    return (
        <Container>
            <ConfirmDialog />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nombre del Alumno</th>
                        <th>Grupo</th>
                        <th>Nombre Artículo</th>
                        <th>Talla</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {reportData.map((report) => (
                        <tr key={report.Id_ReportePrenda}>
                            <td>{report.Nombre_Alumno}</td>
                            <td>{report.Grupo}</td>
                            <td>{report.Nombre_Articulo}</td>
                            <td>{report.Talla}</td>
                            <td>{report.Precio}</td>
                            <td>{report.Cantidad}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEdit(report)}>
                                    Editar
                                </Button>{' '}
                                <Button variant="danger" onClick={() => handleDelete(report.Id_ReportePrenda)}>
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal para editar el reporte */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
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
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <Form.Group controlId="Nombre_Articulo">
                                    <Form.Label>Nombre Artículo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Nombre_Articulo"
                                        value={formData.Nombre_Articulo}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group controlId="Talla">
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
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="success" onClick={handleSave}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default EditarReportesInv;
