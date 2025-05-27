import './CompInicio.css';
import React, { useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import Figure from 'react-bootstrap/Figure';
import { Outlet } from "react-router-dom";
import IniciarSesion from './IniciarSesion';

import { Button } from 'primereact/button';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useNavigate } from 'react-router-dom';


import { Dialog } from 'primereact/dialog';

function CompInicio() {

    const [visibleLogin, setVisibleLogin] = useState(false); // Cambié esto a `false` por defecto.
    

    const navigate = useNavigate();

    const registroSesion = () => {
        navigate('/registrarUsuario');
    }
    const inicioSesion = () => {
        navigate('/iniciarSesion');
    }

    return (
        <Container fluid className="px-0">
            <Row>
                {/* Sección de la información de la escuela */}
                <Col>
                    <Container fluid className="ContenedorPrincipalInicio">
                        <Container className="ContenedorAuxiliarInicio">
                            <Figure className="SeccionPrincipal">
                                <Figure.Image
                                    className="LogoPrepa"
                                    src={require('../img/PLC.png')} // Aquí solo pasas los atributos válidos para una imagen.
                                    alt="Logo Escuela"
                                />
                                <Figure.Caption className="Titulo">
                                    Escuela Preparatoria Por Cooperación Gral Lázaro Cárdenas
                                </Figure.Caption>
                            </Figure>
                            <Row className="InformacionInicio">
                                <label>Ofrecemos educación de calidad para preparar a nuestros estudiantes para un futuro brillante.</label>
                                <label>Excelencia académica y valores humanos.</label>
                                <label>Ubicados en una zona de fácil acceso, con modernas instalaciones.</label>
                                <label>Únete a nuestra comunidad educativa.</label>
                            </Row>
                        </Container>
                    </Container>
                </Col>

                {/* Sección del formulario de inicio de sesión */}
                <Col className="d-flex align-items-center justify-content-center">
                    <Container fluid className="ContenedorPrincipalloginregistro">
                        <Outlet />

                        <div className="welcome-container">
                            <h1 className="welcome-text">Bienvenido</h1>
                        </div>
                        <div className="button-container">
                            <Button
                                label="Iniciar Sesión"
                                onClick={() => setVisibleLogin(true)} // Aquí es donde se usa `setVisibleLogin` correctamente.
                                icon="pi pi-user"
                                className="LR-button"
                            />
                            <Dialog
                                visible={visibleLogin}
                                onHide={() => setVisibleLogin(false)}
                                style={{ width: '50vw' }}
                                breakpoints={{ '960px': '75vw', '641px': '100vw' }}
                            >
                                <IniciarSesion />
                            </Dialog>

                            
                        </div>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}

export default CompInicio;
