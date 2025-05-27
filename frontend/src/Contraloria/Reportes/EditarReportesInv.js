import { useEffect, useState } from 'react';
import {
    Container, Row, Col, Table, Button, Modal, Card
} from 'react-bootstrap';
import axios from 'axios';
import { FaUserPlus } from 'react-icons/fa';
import RegistrarUsuario from '../../Login/RegistrarUsuario';

const URI = 'http://localhost:3001/api/usuarios';

function InfoUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    useEffect(() => {
        getUsuarios();
    }, []);

    const getUsuarios = async () => {
        const res = await axios.get(URI);
        setUsuarios(res.data);
    };

    return (
        <Container className="py-4">
            <Card className="shadow">
                <Card.Body>
                    <Row className="mb-3">
                        <Col className="d-flex justify-content-between align-items-center">
                            <h4 className="text-primary mb-0">Gestión de Usuarios</h4>
                            <Button variant="success" onClick={() => setShowRegisterModal(true)}>
                                <FaUserPlus className="me-2" />
                                Registrar Usuario
                            </Button>
                        </Col>
                    </Row>

                    <Table responsive bordered hover striped className="text-center">
                        <thead className="table-primary">
                            <tr>
                                <th>#</th>
                                <th>Nombre Completo</th>
                                <th>Usuario</th>
                                <th>Contraseña</th>
                                <th>Departamento</th>
                                <th>Rol</th>
                                <th>Domicilio</th>
                                <th>Teléfono</th>
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
                </Card.Body>
            </Card>

            {/* Modal para registrar nuevo usuario */}
            <Modal
                show={showRegisterModal}
                onHide={() => setShowRegisterModal(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Registrar Nuevo Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RegistrarUsuario />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRegisterModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default InfoUsuarios;
