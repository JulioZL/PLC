import React, { useState } from 'react';
import { Container, Form, Row, Col } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegistrarUsuario({ onUsuarioRegistrado }) {

    const navigate = useNavigate();


    const [nombre, setNombre] = useState('');
    const [usuario, setUsuario] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [confirmarContrasenia, setConfirmarContrasenia] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [rol, setRol] = useState('');
    const [domicilio, setDomicilio] = useState('');
    const [noTelefono, setNoTelefono] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (contrasenia !== confirmarContrasenia) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/api/register', {
                Nombre: nombre,
                Usuario: usuario,
                Contrasenia: contrasenia,
                Departamento: departamento,
                rol,
                domicilio,
                no_telefono: noTelefono
            });

            if (response.data.message === "Usuario registrado correctamente") {
                setShowModal(true);
                onUsuarioRegistrado(); // <-- Notificamos a InfoUsuarios
            }
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            alert("Hubo un error al registrar el usuario");
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        navigate(0);
    };

    return (
        <Container fluid className="px-0 ContRegistroSesion">
            <Form className="formRegistroSesion" onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Usuario</Form.Label>
                            <Form.Control type="text" placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" placeholder="**********" value={contrasenia} onChange={(e) => setContrasenia(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirmar Contraseña</Form.Label>
                            <Form.Control type="password" placeholder="**********" value={confirmarContrasenia} onChange={(e) => setConfirmarContrasenia(e.target.value)} />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Departamento</Form.Label>
                            <Form.Control type="text" placeholder="Departamento" value={departamento} onChange={(e) => setDepartamento(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Rol</Form.Label>
                            <Form.Control type="number" placeholder="Rol" value={rol} onChange={(e) => setRol(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Domicilio</Form.Label>
                            <Form.Control type="text" placeholder="Domicilio" value={domicilio} onChange={(e) => setDomicilio(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control type="text" placeholder="Teléfono" value={noTelefono} onChange={(e) => setNoTelefono(e.target.value)} />
                        </Form.Group>
                    </Col>
                </Row>

                <div className="text-center">
                    <Button type="submit" label="Registrarse" className="w-10rem mt-3" />
                </div>
            </Form>
            <Dialog visible={showModal} style={{ width: '50vw' }} header="¡Registro exitoso!" modal onHide={handleModalClose}>
                <p>Tu cuenta ha sido registrada con éxito.</p>
                <Button label="Aceptar" onClick={handleModalClose} autoFocus />
            </Dialog>
        </Container>
    );
}

export default RegistrarUsuario;
