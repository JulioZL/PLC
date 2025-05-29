import React, { useState } from 'react';
import { Button, Form, Container, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function IniciarSesion() {
    const [usuario, setUsuario] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [rol, setRol] = useState('1');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const inicioSesion = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.post('https://plc-j41x.onrender.com/api/login', {
                Usuario: usuario,
                Contrasenia: contrasenia,
                Rol: parseInt(rol)
            });

            if (response.data) {
                sessionStorage.setItem('usuario', JSON.stringify(response.data.user.Usuario));
                sessionStorage.setItem('TUsuario', JSON.stringify(response.data.user.Rol));
                sessionStorage.setItem('isLoggedIn', 'true');

                setSuccess(true);
                setTimeout(() => navigate('/Menu'), 1500); // Espera 1.5s para mostrar éxito
            }

        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 404) {
                setError('Credenciales incorrectas.');
            } else {
                setError('Error al iniciar sesión. Inténtalo de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="px-0">
            <Form onSubmit={inicioSesion} className="formInicioSesion">
                <Form.Group className="mb-3">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        disabled={loading}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="**********"
                        value={contrasenia}
                        onChange={(e) => setContrasenia(e.target.value)}
                        disabled={loading}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Rol</Form.Label>
                    <Form.Control
                        as="select"
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                        disabled={loading}
                    >
                        <option value="1">Admin</option>
                        <option value="2">Encargado</option>
                        <option value="3">Regular</option>
                    </Form.Control>
                </Form.Group>

                <Button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                            />
                            Iniciando...
                        </>
                    ) : (
                        "Iniciar Sesión"
                    )}
                </Button>

                {error && (
                    <Alert variant="danger" className="mt-3 d-flex align-items-center">
                        <FaTimesCircle className="me-2" /> {error}
                    </Alert>
                )}

                {success && (
                    <Alert variant="success" className="mt-3 d-flex align-items-center">
                        <FaCheckCircle className="me-2" /> ¡Inicio de sesión exitoso!
                    </Alert>
                )}
            </Form>
        </Container>
    );
}

export default IniciarSesion;
