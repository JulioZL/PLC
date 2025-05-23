import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Table, InputGroup } from 'react-bootstrap';
import axios from 'axios';

const URI = 'http://localhost:3001/api/usuarios';

function InfoUsuarios() {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        getUsuarios();
    }, []);

    const getUsuarios = async () => {
        const res = await axios.get(URI);
        setUsuarios(res.data);
    };

    return (
        <Container fluid>
            <Row>
                <Col md={8}>
                    <h5>Usuarios</h5>
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre Completo</th>
                                <th>Usuario</th>
                                <th>Contraseña</th>
                                <th>Departamento</th>
                                <th>Rol</th>
                                <th>Domicilio</th>
                                <th>Telefono</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((us) => (
                                <tr key={us.id_usuario}>
                                    <td>{us.id_usuario}</td>
                                    <td>{us.Nombre}</td>
                                    <td>{us.Usuario}</td>
                                    <td>{us.Contrasenia}</td>
                                    <td>{us.Departamento}</td>
                                    <td>{us.Rol}</td>
                                    <td>{us.domicilio}</td>
                                    <td>{us.no_telefono}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                </Col>
            </Row>
        </Container>
    );
}
export default InfoUsuarios;