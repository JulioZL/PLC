import { React, createContext } from 'react';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button, Dropdown, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


function NavBar() {
    const usuario = sessionStorage.getItem('usuario');
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        sessionStorage.removeItem('usuario');
        sessionStorage.removeItem('TUsuario');
        sessionStorage.removeItem('isLoggedIn');
        navigate('/');
    };

    const frases = [
        "¡Bienvenido! Hoy es un gran día para mantener todo en orden.",
        "Organiza, gestiona y lidera. ¡Tú puedes!",
        "¿Ya revisaste los reportes del semestre? Nunca es tarde.",
        "Cada alumno cuenta. Gracias por tu dedicación.",
        "El orden es la base del progreso escolar. ¡Sigue así!"
    ];
    const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];

    const mostrarInicio = location.pathname === "/Menu";

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Navbar superior */}
            <Navbar expand="lg" fixed="top" bg="dark" data-bs-theme="dark" variant="dark" className="shadow-sm">
                <Container>
                    <Navbar.Brand href="/Menu">Gral Lazaro Cárdenas</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav">
                        <Nav className="me-auto">
                            <LinkContainer to="/Menu">
                                <Nav.Link>Inicio</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/Menu/InvPrendas">
                                <Nav.Link>Inventarios</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/Menu/agregarAlumnos">
                                <Nav.Link>Alumnos</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/Menu/informacionUsuarios">
                                <Nav.Link>Usuarios</Nav.Link>
                            </LinkContainer>

                            <Dropdown as={Nav.Item} className="w-100 w-md-auto mb-2 mb-md-0">
                                <Dropdown.Toggle variant="success" className="text-white w-100 w-md-auto">
                                    Reportes
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="w-100 w-md-auto">
                                    <LinkContainer to="/menu/reportes">
                                        <Dropdown.Item>Generar Reporte Semestral</Dropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/menu/reportesInv">
                                        <Dropdown.Item>Generar Reporte Artículos</Dropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/menu/editarReportes">
                                        <Dropdown.Item>Editar Reportes Semestrales</Dropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/menu/editarReportesInv">
                                        <Dropdown.Item>Editar Reportes Artículos</Dropdown.Item>
                                    </LinkContainer>
                                </Dropdown.Menu>
                            </Dropdown>

                            <Dropdown as={Nav.Item} className="w-100 w-md-auto ms-md-2 mb-2 mb-md-0">
                                <Dropdown.Toggle variant="success" className="text-white w-100 w-md-auto">
                                    Histórico
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="w-100 w-md-auto">
                                    <LinkContainer to="/menu/historicoReportes">
                                        <Dropdown.Item>Histórico Semestral</Dropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/menu/historicoReportesInv">
                                        <Dropdown.Item>Histórico Artículos</Dropdown.Item>
                                    </LinkContainer>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>

                        <Nav className="ms-auto">
                            <Nav.Item className="d-flex align-items-center bg-dark bg-opacity-25 rounded px-3 py-1 text-white">
                                {usuario ? (
                                    <>
                                        <i className="bi bi-person-circle me-2"></i>
                                        <span className="me-3">
                                            Sesión iniciada como: <strong>{usuario}</strong>
                                        </span>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="rounded-pill"
                                            onClick={handleLogout}
                                        >
                                            Cerrar sesión
                                        </Button>
                                    </>
                                ) : (
                                    <span>Sesión no iniciada</span>
                                )}
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
                </Navbar>

            {/* Separador para evitar solapamiento del navbar */}
            <div style={{ height: '80px' }}></div>

            {/* Contenido principal */}
            <Container
                fluid
                className="bg-white shadow-sm rounded p-4 flex-grow-1"
                style={{ maxWidth: '1200px' }}
            >
                {mostrarInicio ? (
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>¡Bienvenido al sistema!</Card.Title>
                            <Card.Text>{fraseAleatoria}</Card.Text>

                            {/* Imagen con enlace */}
                            <a
                                href="https://elpaellador.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Card.Img
                                    variant="bottom"
                                    src="https://elpaellador.com/en-construccion.png"
                                    alt="El Paellador"
                                    style={{ maxHeight: '600px', objectFit: 'contain', borderRadius: '8px', marginTop: '10px' }}
                                />
                            </a>
                        </Card.Body>
                    </Card>
                ) : (
                    <Outlet />
                )}

            </Container>

            {/* Footer pegado abajo */}
            <footer className="bg-dark text-white text-center py-3 mt-auto">
                <Container>
                    <small>&copy; {new Date().getFullYear()} Marlen Alcaraz Malagon. Todos los derechos reservados.</small>
                </Container>
            </footer>
        </div>
    );
}

export default NavBar;
