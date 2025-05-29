import { useEffect, useState } from 'react';
import {
    Container, Row, Col, Table, Button, Modal, Card
} from 'react-bootstrap';
import axios from 'axios';
import { FaUserPlus } from 'react-icons/fa';
import RegistrarUsuario from '../../Login/RegistrarUsuario';

import config from '../../config';

function InfoUsuarios() {
    const URI = config.URI+'api/usuarios'

    const [usuarios, setUsuarios] = useState([]);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const getUsuarios = async () => {
        try {
            const res = await axios.get(URI);
            setUsuarios(res.data);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        }
    };

    useEffect(() => {
        getUsuarios();
    }, []);

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
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id_usuario}>
                                    <td>{usuario.id_usuario}</td>
                                    <td>{usuario.Nombre}</td>
                                    <td>{usuario.Usuario}</td>
                                    <td>{usuario.Contrasenia}</td>
                                    <td>{usuario.Departamento}</td>
                                    <td>{usuario.Rol}</td>
                                    <td>{usuario.domicilio}</td>
                                    <td>{usuario.no_telefono}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal
                show={showRegisterModal}
                onHide={() => setShowRegisterModal(false)}
                size="xl"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Registrar Nuevo Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RegistrarUsuario onUsuarioRegistrado={getUsuarios} />
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
