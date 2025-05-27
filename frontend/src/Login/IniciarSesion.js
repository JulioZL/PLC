import React, { useState } from 'react';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function IniciarSesion() {
    const [usuario, setUsuario] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [rol, setRol] = useState('1');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const inicioSesion = async (e) => {
        e.preventDefault();

        try {

            const response = await axios.post('https://plc-j41x.onrender.com/api/login', {
                Usuario: usuario.trim(),
                    Contrasenia: contrasenia,
                    Rol: parseInt(rol)
                });

                if (response.data) {
                    console.log("Datos recibidos del servidor:", response.data.user);

                    sessionStorage.setItem('usuario', JSON.stringify(response.data.user.Usuario));
                    sessionStorage.setItem('TUsuario', JSON.stringify(response.data.user.Rol));
                    sessionStorage.setItem('isLoggedIn', 'true');

                    navigate('/Menu');
                }

        } catch (err) {
            console.log('Error al iniciar sesión:', err);
            setError('Error al iniciar sesión');
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
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="**********"
                        value={contrasenia}
                        onChange={(e) => setContrasenia(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Rol</Form.Label>
                    <Form.Control
                        as="select"
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                    >
                        <option value="1">Admin</option>
                        <option value="2">Encargado</option>
                        <option value="3">Regular</option>
                    </Form.Control>
                </Form.Group>

                <Button type="submit" className="btn btn-primary">Iniciar Sesión</Button>
                {error && <p className="text-danger">{error}</p>}
            </Form>
        </Container>
    );
}

export default IniciarSesion;
