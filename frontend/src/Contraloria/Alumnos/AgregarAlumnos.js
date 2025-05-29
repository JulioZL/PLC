import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Card } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaSave, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../config';


//function RegistroNombres() {
//    const [form, setForm] = useState({ nombre: '', apellidoP: '', apellidoM: '' });
//    const [registros, setRegistros] = useState([]);
//    const [modoEdicion, setModoEdicion] = useState(null);

//    const handleChange = (e) => {
//        setForm({ ...form, [e.target.name]: e.target.value });
//    };

//    const handleGuardar = () => {
//        if (modoEdicion !== null) {
//            const nuevosRegistros = registros.map((item, index) =>
//                index === modoEdicion ? form : item
//            );
//            setRegistros(nuevosRegistros);
//            setModoEdicion(null);
//        } else {
//            setRegistros([...registros, form]);
//        }
//        setForm({ nombre: '', apellidoP: '', apellidoM: '' });
//    };

//    const handleEditar = (index) => {
//        setForm(registros[index]);
//        setModoEdicion(index);
//    };

//    const handleEliminar = (index) => {
//        const nuevos = registros.filter((_, i) => i !== index);
//        setRegistros(nuevos);
//        if (modoEdicion === index) {
//            setModoEdicion(null);
//            setForm({ nombre: '', apellidoP: '', apellidoM: '' });
//        }
//    };

const RegistroNombres = () => {
    const [form, setForm] = useState({ nombre: '', apellidoP: '', apellidoM: '' });
    const [registros, setRegistros] = useState([]);
    const [modoEdicion, setModoEdicion] = useState(null);

    const navigate = useNavigate();

    const URI = config.URI;

    // Cargar registros desde backend al montar componente
    useEffect(() => {
        cargarRegistros();
    }, []);

    const cargarRegistros = async () => {
        try {
            const res = await axios.get(URI);
            setRegistros(res.data);
        } catch (error) {
            console.error('Error cargando registros:', error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGuardar = async (e) => {
        e.preventDefault();

        try {
            if (modoEdicion !== null) {
                // Actualizar registro existente
                const id = registros[modoEdicion]._id; // Asumiendo que backend devuelve _id
                await axios.put(`${URI}${id}`, form);
                const registrosActualizados = registros.map((item, index) =>
                    index === modoEdicion ? form : item
                );
                setRegistros(registrosActualizados);
                setModoEdicion(null);
            } else {
                // Crear nuevo registro
                const res = await axios.post(URI, form);
                setRegistros([...registros, res.data]);
            }

            setForm({ nombre: '', apellidoP: '', apellidoM: '' });
            // Navegar si quieres, por ejemplo:
            // navigate('/menu/InformacionUsuarios');
        } catch (error) {
            console.error('Error guardando:', error);
        }
    };

    const handleEditar = (index) => {
        setForm(registros[index]);
        setModoEdicion(index);
    };

    const handleEliminar = async (index) => {
        try {
            const id = registros[index]._id;
            await axios.delete(`${URI}${id}`);
            const nuevos = registros.filter((_, i) => i !== index);
            setRegistros(nuevos);
            if (modoEdicion === index) {
                setModoEdicion(null);
                setForm({ nombre: '', apellidoP: '', apellidoM: '' });
            }
        } catch (error) {
            console.error('Error eliminando:', error);
        }
    };

    return (
        <Container className="py-4">
            <Row>
                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h5 className="text-primary text-center mb-3">
                                {modoEdicion !== null ? 'Editar Alumno' : 'Registrar Alumno'}
                            </h5>
                            <Form onSubmit={handleGuardar}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre(s)</Form.Label>
                                    <Form.Control
                                        name="nombre"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        placeholder="Ej. Marlen"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Apellido Paterno</Form.Label>
                                    <Form.Control
                                        name="apellidoP"
                                        value={form.apellidoP}
                                        onChange={handleChange}
                                        placeholder="Ej. Alcaraz"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Apellido Materno</Form.Label>
                                    <Form.Control
                                        name="apellidoM"
                                        value={form.apellidoM}
                                        onChange={handleChange}
                                        placeholder="Ej. Malagon"
                                        required
                                    />
                                </Form.Group>
                                <div className="text-center">
                                    <Button type="submit" variant="success">
                                        {modoEdicion !== null ? (
                                            <>
                                                <FaSave className="me-2" />
                                                Actualizar
                                            </>
                                        ) : (
                                            <>
                                                <FaPlus className="me-2" />
                                                Agregar
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h5 className="text-primary text-center mb-3">Alumnos Registrados</h5>
                            <Table responsive bordered hover className="text-center">
                                <thead className="table-primary">
                                    <tr>
                                        <th>#</th>
                                        <th>Nombre Completo</th>
                                        <th>Editar</th>
                                        <th>Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registros.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-muted text-center">
                                                No hay registros aún.
                                            </td>
                                        </tr>
                                    ) : (
                                        registros.map((item, index) => (
                                            <tr key={item._id || index}>
                                                <td>{index + 1}</td>
                                                <td>{`${item.nombre} ${item.apellidoP} ${item.apellidoM}`}</td>
                                                <td>
                                                    <Button
                                                        variant="warning"
                                                        size="sm"
                                                        onClick={() => handleEditar(index)}
                                                    >
                                                        <FaEdit className="me-1" />
                                                        Editar
                                                    </Button>
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleEliminar(index)}
                                                    >
                                                        <FaTrashAlt className="me-1" />
                                                        Eliminar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RegistroNombres;

