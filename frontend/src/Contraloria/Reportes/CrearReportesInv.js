import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Card, InputGroup } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './crearReportesSem.css';

function CrearReportesInv() {
    const [reportData, setReportData] = useState([]);
    const [formData, setFormData] = useState({
        IDreporte: Date.now().toString(),
        nombreAlumno: '',
        grupoAlumno: '',
        nombreArticulo: '',
        talla: '',
        precio: '',
        cantidad: '',
        lugar: 'Yuriria, GTO.',
        fecha: new Date().toLocaleDateString(),
    });
    const [filteredAlumnos, setFilteredAlumnos] = useState([]);

    const validateArticleFields = () => {
        const { nombreArticulo, talla, precio, cantidad } = formData;
        if (!nombreArticulo.trim()) {
            toast.error('El nombre del artículo es obligatorio.');
            return false;
        }
        if (!talla.trim()) {
            toast.error('La talla es obligatoria.');
            return false;
        }
        if (!precio || isNaN(precio) || precio <= 0) {
            toast.error('El precio debe ser un número mayor a 0.');
            return false;
        }
        if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
            toast.error('La cantidad debe ser un número mayor a 0.');
            return false;
        }
        return true;
    };

    const validateReportFields = () => {
        if (!formData.nombreAlumno.trim()) {
            toast.error('El nombre del alumno es obligatorio.');
            return false;
        }
        if (!formData.grupoAlumno.trim()) {
            toast.error('El grupo del alumno es obligatorio.');
            return false;
        }
        if (reportData.length === 0) {
            toast.error('Debes agregar al menos un artículo al reporte.');
            return false;
        }
        return true;
    };

    const resetForm = () => {
        setFormData({
            IDreporte: Date.now().toString(),
            nombreAlumno: '',
            grupoAlumno: '',
            nombreArticulo: '',
            talla: '',
            precio: '',
            cantidad: '',
            lugar: 'Yuriria, GTO.',
            fecha: new Date().toLocaleDateString(),
        });
        setReportData([]);
    };

    const handleSaveReport = async () => {
        if (!validateReportFields()) return;

        const payload = reportData.map(item => ({
            Nombre_Alumno: formData.nombreAlumno,
            Grupo: formData.grupoAlumno,
            Nombre_Articulo: item.nombreArticulo,
            Talla: item.talla,
            Precio: item.precio,
            Cantidad: item.cantidad,
        }));

        try {
            const response = await axios.post('/api/reportesprenda', payload);

            if (response.status === 200) {
                toast.success('Reporte guardado correctamente.');
                resetForm();   
            } else {
                toast.error('Error al guardar el reporte. Inténtalo nuevamente.');
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
                const response = await axios.get('https://plc-j41x.onrender.com/api/alumnos', { params: { NombreAlumno: value } });
                setFilteredAlumnos(response.data);
            } catch (error) {
                console.error('Error al buscar alumnos:', error);
                setFilteredAlumnos([]);
                toast.error('Error al buscar alumnos.');
            }
        } else if (name === 'nombreAlumno') {
            setFilteredAlumnos([]);
        }
    };

    const handleSelectAlumno = (alumno) => {
        setFormData({ ...formData, nombreAlumno: alumno.NombreAlumno, grupoAlumno: alumno.Grupo });
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

    const calculateTotal = () => reportData.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2);

    return (
        <Container className="p-4" style={{ maxWidth: '900px' }}>
            <ToastContainer />
            <Card className="mb-4 shadow">
                <Card.Body>
                    <Card.Title className="text-center mb-4">
                        <h4>Generador de Reportes - Inventario</h4>
                    </Card.Title>
                    <Form>
                        <Row className="mb-3">
                            <Col sm={6}>
                                <Form.Label>Nombre del Alumno</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        name="nombreAlumno"
                                        value={formData.nombreAlumno}
                                        onChange={handleChange}
                                        placeholder="Ingresa el nombre del alumno"
                                    />
                                    <ul className="autocomplete-list autcpl">
                                        {filteredAlumnos.map(alumno => (
                                            <li key={alumno.id_alumno} onClick={() => handleSelectAlumno(alumno)}>
                                                {alumno.NombreAlumno} ({alumno.Grupo})
                                            </li>
                                        ))}
                                    </ul>
                                </InputGroup>
                            </Col>
                            <Col sm={6}>
                                <Form.Label>Grupo</Form.Label>
                                <Form.Control type="text" name="grupoAlumno" value={formData.grupoAlumno} readOnly />
                            </Col>
                        </Row>

                        <h5 className="mb-3">Agregar Artículos</h5>
                        <Row className="mb-3">
                            <Col sm={6}>
                                <Form.Label>Nombre del Artículo</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombreArticulo"
                                    value={formData.nombreArticulo}
                                    onChange={handleChange}
                                    placeholder="Nombre del artículo"
                                />
                            </Col>
                            <Col sm={3}>
                                <Form.Label>Talla</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="talla"
                                    value={formData.talla}
                                    onChange={handleChange}
                                    placeholder="Talla"
                                />
                            </Col>
                            <Col sm={3}>
                                <Form.Label>Precio</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="precio"
                                    value={formData.precio}
                                    onChange={handleChange}
                                    placeholder="Precio"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={3}>
                                <Form.Label>Cantidad</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="cantidad"
                                    value={formData.cantidad}
                                    onChange={handleChange}
                                    placeholder="Cantidad"
                                />
                            </Col>
                            <Col sm={3} className="d-flex align-items-end">
                                <Button variant="primary" onClick={handleAddArticle}>
                                    Agregar
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            <Card className="mb-4 shadow">
                <Card.Body>
                    <Card.Title>Artículos en el Reporte</Card.Title>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Talla</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
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
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Button variant="success" className="w-100" onClick={handleSaveReport}>
                Guardar y Exportar Reporte
            </Button>
        </Container>
    );
}

export default CrearReportesInv;
