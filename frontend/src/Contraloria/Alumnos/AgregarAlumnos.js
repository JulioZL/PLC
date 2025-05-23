import { useState } from 'react';
import { Container, Row, Col, Form, Button, Table, InputGroup } from 'react-bootstrap';
    function RegistroNombres() {
        const [form, setForm] = useState({ nombre: '', apellidoP: '', apellidoM: '' });
        const [registros, setRegistros] = useState([]);
        const [modoEdicion, setModoEdicion] = useState(null);

        const handleChange = (e) => {
            setForm({ ...form, [e.target.name]: e.target.value });
        };

        const handleGuardar = () => {
            if (modoEdicion !== null) {
                const nuevosRegistros = registros.map((item, index) =>
                    index === modoEdicion ? form : item
                );
                setRegistros(nuevosRegistros);
                setModoEdicion(null);
            } else {
                setRegistros([...registros, form]);
            }
            setForm({ nombre: '', apellidoP: '', apellidoM: '' });
        };

        const handleEditar = (index) => {
            setForm(registros[index]);
            setModoEdicion(index);
        };

        const handleEliminar = (index) => {
            const nuevos = registros.filter((_, i) => i !== index);
            setRegistros(nuevos);
            if (modoEdicion === index) {
                setModoEdicion(null);
                setForm({ nombre: '', apellidoP: '', apellidoM: '' });
            }
        };

        return (
            <Container fluid>
                <Row>
                    {/* Lado izquierdo */}
                    <Col md={4}>
                        <h5>Registrar Alumno</h5>
                        <Form.Group className="mb-2">
                            <Form.Label>Nombre(s)</Form.Label>
                            <Form.Control
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                size="sm"
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Apellido Paterno</Form.Label>
                            <Form.Control
                                name="apellidoP"
                                value={form.apellidoP}
                                onChange={handleChange}
                                size="sm"
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Apellido Materno</Form.Label>
                            <Form.Control
                                name="apellidoM"
                                value={form.apellidoM}
                                onChange={handleChange}
                                size="sm"
                            />
                        </Form.Group>
                        <Button onClick={handleGuardar} variant="primary" size="sm" className="d-block mx-auto">
                            {modoEdicion !== null ? 'Actualizar' : 'Agregar'}
                        </Button>
                    </Col>

                    {/* Lado derecho */}
                    <Col md={8}>
                        <h5>Alumnos Registrados</h5>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre Completo</th>
                                    <th>Editar</th>
                                    <th>Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registros.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{`${item.nombre} ${item.apellidoP} ${item.apellidoM}`}</td>
                                        <td>
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                onClick={() => handleEditar(index)}
                                            >
                                                Editar
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleEliminar(index)}
                                            >
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {registros.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            No hay registros aún.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        );
    }

    export default RegistroNombres;


        
   