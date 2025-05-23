import React from 'react';
import { Outlet, useNavigate } from "react-router-dom"; // Importar useNavigate
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Dropdown } from 'react-bootstrap';

function NavBar() {
    // Obtener el nombre del usuario desde sessionStorage
    const usuario = sessionStorage.getItem('usuario');  // Suponiendo que guardas el nombre del usuario con la clave 'usuario'

    const navigate = useNavigate();  // Hook para navegar a otras rutas

    const handleLogout = () => {
        // Eliminar las credenciales del usuario de sessionStorage
        sessionStorage.removeItem('usuario');  // O 'nombreUsuario' si usas esa clave
        sessionStorage.removeItem('TUsuario');  // Eliminar cualquier otra credencial si es necesario
        sessionStorage.removeItem('isLoggedIn');  // Eliminar cualquier otra credencial si es necesario

        // Redirigir al usuario a la página principal
        navigate('/');
    };

    return (
        <Container fluid className="px-0">
            <Navbar expand="lg" className="fixed-top bg-success" bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#home">Gral Lazaro Cárdenas</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Nav className="me-auto">
                        <LinkContainer to="/Menu">
                            <Nav.Link>Inicio</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="InvPrendas">
                            <Nav.Link>Inventarios</Nav.Link>
                        </LinkContainer>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Reportes
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <LinkContainer to="/menu/reportes">
                                    <Dropdown.Item>Generar Reporte Semestral</Dropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/menu/reportesInv">
                                    <Dropdown.Item>Generar Reporte Uniformes</Dropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/menu/editarReportes">
                                    <Dropdown.Item>Editar Reportes Semestrales</Dropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/menu/editarReportesInv">
                                    <Dropdown.Item>Editar Reportes Prendas</Dropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/menu/historicoReportes">
                                    <Dropdown.Item>Histórico Semestral</Dropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/menu/historicoReportesInv">
                                    <Dropdown.Item>Histórico Prendas</Dropdown.Item>
                                </LinkContainer>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            {/* Mostrar el nombre del usuario logueado */}
                            {usuario ? (
                                <>
                                    <span>Sesión iniciada como: {usuario}</span>
                                    {/* Botón de cerrar sesión */}
                                    <Button
                                        variant="link"
                                        className="text-white ms-3"
                                        onClick={handleLogout}
                                    >
                                        Cerrar sesión
                                    </Button>
                                </>
                            ) : (
                                'Sesión no iniciada'
                            )}
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container fluid className="ContenedorPrincipalloginregistro">
                <Outlet />
            </Container>
        </Container>
    );
}

export default NavBar;
