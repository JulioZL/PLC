import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExportPDFReportes from './ExportPDFReportes.js';
import './crearReportesSem.css';

function CrearReportesSEM() {
    const [reportData, setReportData] = useState([]);
    const [formData, setFormData] = useState({
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

    const [alumnos, setAlumnos] = useState([]);
    const [filteredAlumnos, setFilteredAlumnos] = useState([]);
    const [conceptos, setConceptos] = useState([]);

    useEffect(() => {
        const fetchConceptos = async () => {
            try {
                const response = await axios.get('https://plc-j41x.onrender.com/api/conceptos');
                setConceptos(response.data);
            } catch (error) {
                toast.error('Error al obtener los conceptos.');
            }
        };
        fetchConceptos();
    }, []);

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
            const response = await axios.post('https://plc-j41x.onrender.com/api/reportes', reportToSave);
            if (response.status === 200) {
                toast.success('Reporte guardado correctamente.');
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
                const response = await axios.get(`https://plc-j41x.onrender.com/api/alumnos`, {
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
            Nombre_Alumno: alumno.NombreAlumno,
            Grupo: alumno.Grupo,
        });
        setFilteredAlumnos([]);
    };

    const handleAddReport = () => {
        if (!validateForm()) return;

        if (reportData.length > 0) {
            toast.warning('Solo puedes agregar un reporte a la vez.');
            return;
        }

        const newReport = {
            ...formData,
            Total: formData.Precio * formData.Cantidad || 0,
        };
        setReportData([newReport]);
        toast.success('Reporte agregado correctamente.');
    };

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

    const cicloEscolarOptions = ["Enero - Junio", "Agosto - Diciembre"];
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    return (
        <div className="p-4 contCrearRep bg-light rounded shadow-sm">
            <ToastContainer />
            <h4 className="mb-4 text-center">Generación de Reportes Semestrales</h4>
            <Form>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>Nombre Alumno</Form.Label>
                    <Col sm={4}>
                        <Form.Control
                            type="text"
                            name="Nombre_Alumno"
                            value={formData.Nombre_Alumno}
                            onChange={handleChange}
                            placeholder="Ingresa el nombre del alumno"
                        />
                        <div className="autocomplete-list">
                            {filteredAlumnos.map((alumno) => (
                                <div
                                    key={alumno.id_alumno}
                                    onClick={() => handleSelectAlumno(alumno)}
                                    className="autocomplete-item"
                                >
                                    {alumno.NombreAlumno}
                                </div>
                            ))}
                        </div>
                    </Col>
                    <Form.Label column sm={2}>Semestre</Form.Label>
                    <Col sm={4}>
                        <Form.Control
                            as="select"
                            name="Semestre"
                            value={formData.Semestre}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona el semestre</option>
                            {[1, 2, 3, 4, 5, 6].map(sem => <option key={sem} value={sem}>{sem}</option>)}
                        </Form.Control>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>Grupo</Form.Label>
                    <Col sm={3}>
                        <Form.Control
                            type="text"
                            name="Grupo"
                            value={formData.Grupo}
                            readOnly
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

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>Mes de Pago</Form.Label>
                    <Col sm={4}>
                        <Form.Control
                            as="select"
                            name="Mes_de_Pago"
                            value={formData.Mes_de_Pago}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona el mes</option>
                            {months.map((month, index) => (
                                <option key={index} value={month}>{month}</option>
                            ))}
                        </Form.Control>
                    </Col>
                    <Form.Label column sm={2}>Ciclo Escolar</Form.Label>
                    <Col sm={4}>
                        <Form.Control
                            as="select"
                            name="Ciclo_Escolar"
                            value={formData.Ciclo_Escolar}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona el ciclo escolar</option>
                            {cicloEscolarOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </Form.Control>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={1}>Precio</Form.Label>
                    <Col sm={3}>
                        <Form.Control
                            type="number"
                            name="Precio"
                            value={formData.Precio}
                            onChange={handleChange}
                            placeholder="Ingresa el precio"
                        />
                    </Col>
                    <Form.Label column sm={1}>Cantidad</Form.Label>
                    <Col sm={3}>
                        <Form.Control
                            type="number"
                            name="Cantidad"
                            value={formData.Cantidad}
                            onChange={handleChange}
                            placeholder="Ingresa la cantidad"
                        />
                    </Col>
                    <Form.Label column sm={1}>Fecha</Form.Label>
                    <Col sm={3}>
                        <Form.Control
                            type="text"
                            name="fecha"
                            value={formData.Fecha}
                            readOnly
                        />
                    </Col>
                </Form.Group>

                <Button variant="primary" onClick={handleAddReport} className="w-100">
                    Agregar al Reporte
                </Button>
            </Form>

            <h5 className="mt-4">Datos del Reporte</h5>
            <Table striped bordered hover className="mt-3">
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
                        <th>Lugar</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {reportData.map((report, index) => (
                        <tr key={index}>
                            <td>{report.Nombre_Alumno}</td>
                            <td>{report.Semestre}</td>
                            <td>{report.Grupo}</td>
                            <td>{report.Concepto}</td>
                            <td>{report.Precio}</td>
                            <td>{report.Cantidad}</td>
                            <td>{report.Total}</td>
                            <td>{report.Mes_de_Pago}</td>
                            <td>{report.Ciclo_Escolar}</td>
                            <td>{report.Lugar}</td>
                            <td>{report.Fecha}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Button
                variant="success"
                onClick={async () => {
                    const reportToSave = reportData[0];
                    ExportPDFReportes(reportToSave);
                    await handleSaveReport();
                }}
                disabled={reportData.length === 0}
                className="mt-3 w-100"
            >
                Guardar y Exportar a PDF
            </Button>
        </div>
    );
}

export default CrearReportesSEM;
