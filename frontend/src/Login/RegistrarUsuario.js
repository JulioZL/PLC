import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import CryptoJS from 'crypto-js';
import axios from 'axios';

function RegistrarUsuario() {
    const [nombre, setNombre] = useState('');
    const [usuario, setUsuario] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [confirmarContrasenia, setConfirmarContrasenia] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [rol, setRol] = useState(''); // Nuevo estado para rol
    const [domicilio, setDomicilio] = useState('');
    const [noTelefono, setNoTelefono] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (contrasenia !== confirmarContrasenia) {
            alert('Las contraseñas no coinciden');
            return;
        }

        const encryptedPassword = contrasenia;

        try {
            const response = await axios.post('http://localhost:3001/api/register', {
                Nombre: nombre,
                Usuario: usuario,
                Contrasenia: encryptedPassword,
                Departamento: departamento,
                rol, // Enviar rol
                domicilio,
                no_telefono: noTelefono
            });

            if (response.data.message === "Usuario registrado correctamente") {
                setShowModal(true);
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
                <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control type="text" placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password" placeholder="**********" value={contrasenia} onChange={(e) => setContrasenia(e.target.value)} />
                    <Form.Label>Confirmar Contraseña</Form.Label>
                    <Form.Control type="password" placeholder="**********" value={confirmarContrasenia} onChange={(e) => setConfirmarContrasenia(e.target.value)} />
                    <Form.Label>Departamento</Form.Label>
                    <Form.Control type="text" placeholder="Departamento" value={departamento} onChange={(e) => setDepartamento(e.target.value)} />
                    <Form.Label>Rol</Form.Label>
                    <Form.Control type="number" placeholder="Rol" value={rol} onChange={(e) => setRol(e.target.value)} />
                    <Form.Label>Domicilio</Form.Label>
                    <Form.Control type="text" placeholder="Domicilio" value={domicilio} onChange={(e) => setDomicilio(e.target.value)} />
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control type="text" placeholder="Teléfono" value={noTelefono} onChange={(e) => setNoTelefono(e.target.value)} />
                </Form.Group>
                <Button type="submit" label="Registrarse" className="w-10rem mx-auto" />
            </Form>
            <Dialog visible={showModal} style={{ width: '50vw' }} header="¡Registro exitoso!" modal onHide={() => setShowModal(false)}>
                <p>Tu cuenta ha sido registrada con éxito.</p>
                <Button label="Aceptar" onClick={handleModalClose} autoFocus />
            </Dialog>
        </Container>
    );
}

export default RegistrarUsuario;
