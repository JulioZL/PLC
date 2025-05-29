import React, { useState } from "react";
import { Container, Row, Col, Figure } from 'react-bootstrap';
import { Outlet, useNavigate } from "react-router-dom";
import IniciarSesion from './IniciarSesion';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import './CompInicio.css'; // Importa los estilos externos

function CompInicio() {
    const [visibleLogin, setVisibleLogin] = useState(false);
    const navigate = useNavigate();

    return (
        <Container fluid className="comp-inicio-container">
            <Row className="comp-inicio-row">
                <Col className="info-col">
                    <Container fluid className="contenedor-principal-inicio">
                        <Container className="contenedor-auxiliar-inicio">
                            <Figure className="seccion-principal">
                                <Figure.Image
                                    src={require('../img/PLC.png')}
                                    alt="Logo Escuela"
                                    className="logo-prepa"
                                />
                                <Figure.Caption className="titulo">
                                    Escuela Preparatoria Por Cooperación Gral Lázaro Cárdenas
                                </Figure.Caption>
                            </Figure>
                            <Row>
                                <label className="info-label">Ofrecemos educación de calidad para preparar a nuestros estudiantes para un futuro brillante.</label>
                                <label className="info-label">Excelencia académica y valores humanos.</label>
                                <label className="info-label">Ubicados en una zona de fácil acceso, con modernas instalaciones.</label>
                                <label className="info-label">Únete a nuestra comunidad educativa.</label>
                            </Row>
                        </Container>
                    </Container>
                </Col>

                <Col className="login-col">
                    <Container fluid className="contenedor-login">
                        <Outlet />
                        <div className="welcome-container">
                            <h1 className="welcome-text">Bienvenido</h1>
                        </div>
                        <div>
                            <Button
                                label="Iniciar Sesión"
                                onClick={() => setVisibleLogin(true)}
                                icon="pi pi-user"
                                className="lr-button"
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
