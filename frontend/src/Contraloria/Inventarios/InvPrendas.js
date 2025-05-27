import axios from 'axios';
import { useState, useEffect } from 'react';
import { Table, Button, Modal, Container, Card, Form } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import EditarPrenda from './EditarPrenda';
import AgregarPrenda from './AgregarPrenda'; // <-- Importar componente

const URI = 'http://localhost:3001/api/prendas/';

const CompMostrarPrendas = () => {
    const [prendas, setPrendas] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const rol = sessionStorage.getItem('TUsuario');

    useEffect(() => {
        getPrendas();
    }, []);

    const getPrendas = async () => {
        const res = await axios.get(URI);
        setPrendas(res.data);
    };

    const deletePrenda = async (id) => {
        try {
            await axios.delete(URI + id);
            toast.success('Artículo eliminado correctamente.');
            getPrendas();
        } catch (error) {
            toast.error('No se puede eliminar una prenda que ya ha sido utilizada. Puedes poner su stock en 0 si ya no está disponible.');
        }
    };

    const handleEditClick = (id) => {
        setSelectedId(id);
        setShowEditModal(true);
    };

    const prendasFiltradas = prendas
        .filter(p => p.nombre_prenda.toLowerCase().includes(filtroNombre.toLowerCase()))
        .sort((a, b) => a.nombre_prenda.localeCompare(b.nombre_prenda));

    return (
        <Container className="py-4">
            <Card className="shadow">
                <Card.Body>
                    <Card.Title className="text-center mb-4 text-uppercase border-bottom pb-2">
                        <FaEdit className="me-2" /> Inventario de Artículos
                    </Card.Title>

                    {(rol === '1' || rol === '2') && (
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Buscar por nombre"
                                value={filtroNombre}
                                onChange={(e) => setFiltroNombre(e.target.value)}
                                style={{ maxWidth: '300px' }}
                            />
                            <Button variant="success" onClick={() => setShowAddModal(true)}>
                                <FaPlus className="me-2" /> Agregar Artículo
                            </Button>
                        </div>
                    )}

                    <Table responsive bordered hover className="text-center align-middle">
                        <thead>
                            <tr style={{ backgroundColor: '#003366', color: 'white' }}>
                                <th style={{ backgroundColor: '#099E50', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>ID</th>
                                <th style={{ backgroundColor: '#099E50', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Nombre</th>
                                <th style={{ backgroundColor: '#099E50', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Talla</th>
                                <th style={{ backgroundColor: '#099E50', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Unidades</th>
                                <th style={{ backgroundColor: '#099E50', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Precio</th>
                                <th style={{ backgroundColor: '#099E50', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prendasFiltradas.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted">
                                        No hay prendas registradas.
                                    </td>
                                </tr>
                            ) : (
                                prendasFiltradas.map((prenda) => (
                                    <tr key={prenda.id_prenda}>
                                        <td>{prenda.id_prenda}</td>
                                        <td>{prenda.nombre_prenda}</td>
                                        <td>{prenda.talla}</td>
                                        <td>{prenda.unidades}</td>
                                        <td>${parseFloat(prenda.precio).toFixed(2)}</td>
                                        <td>
                                            {(rol === '1' || rol === '2') && (
                                                <>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleEditClick(prenda.id_prenda)}
                                                    >
                                                        <FaEdit />
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => deletePrenda(prenda.id_prenda)}
                                                    >
                                                        <FaTrashAlt />
                                                    </Button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Modal de Edición */}
            <Modal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton style={{ backgroundColor: '#099E50', color: 'white' }}>
                    <Modal.Title>Editar Artículo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditarPrenda
                        id={selectedId}
                        onSuccess={() => {
                            setShowEditModal(false); // cerrar modal
                            getPrendas(); // refrescar tabla
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowEditModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Agregar */}
            <Modal
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton style={{ backgroundColor: '#099E50', color: 'white' }}>
                    <Modal.Title>Agregar Artículo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AgregarPrenda onSuccess={() => {
                        setShowAddModal(false);
                        getPrendas();
                        
                    }} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowAddModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CompMostrarPrendas;
