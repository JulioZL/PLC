import axios from 'axios';
import { useState } from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Card,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import config from '../../config';


const tallasDisponibles = [
    14, 16, 18, 28, 30, 32, 34, 36, 38, 40, 42, 44, 'CH', 'MD', 'GD', 'XL', 'UT', 'NA',
];

const CompAgregarPrenda = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        nombrePrenda: '',
        talla: '',
        unidades: '',
        precio: '',
    });

    const URI = config.URI + 'api/prendas';

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const guardar = async (e) => {
        e.preventDefault();

        if (
            !formData.nombrePrenda.trim() ||
            !formData.talla.trim() ||
            !formData.unidades ||
            !formData.precio
        ) {
            toast.error('Por favor completa todos los campos.');
            return;
        }

        try {
            await axios.post(URI, {
                nombre_prenda: formData.nombrePrenda,
                talla: formData.talla,
                unidades: Number(formData.unidades),
                precio: parseFloat(formData.precio),
            });

            toast.success('Prenda agregada con éxito.');

            if (onSuccess) onSuccess(); // <- cerrar modal y actualizar tabla

        } catch (error) {
            toast.error('Error al guardar la prenda.\nVerifica si la prenda ya existe.', {
                style: { whiteSpace: 'pre-line' }
            });
        }
    };

    return (
        <Container className="py-4">
            <Card className="shadow mx-auto" style={{ maxWidth: '600px' }}>
                <Card.Body>
                    <Form onSubmit={guardar}>
                        <Form.Group className="mb-3" controlId="nombrePrenda">
                            <Form.Label>Nombre del artículo</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el nombre del artículo"
                                name="nombrePrenda"
                                value={formData.nombrePrenda}
                                onChange={handleChange}
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="talla">
                            <Form.Label>Talla</Form.Label>
                            <Form.Select
                                name="talla"
                                value={formData.talla}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona una talla</option>
                                {tallasDisponibles.map((talla) => (
                                    <option key={talla} value={talla}>
                                        {talla}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>


                        <Form.Group className="mb-3" controlId="unidades">
                            <Form.Label>Unidades</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                step="1"
                                placeholder="Cantidad disponible"
                                name="unidades"
                                value={formData.unidades}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="precio">
                            <Form.Label>Precio (MXN)</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                step="1"
                                placeholder="Precio en MXN"
                                name="precio"
                                value={formData.precio}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <div className="d-grid">
                            <Button variant="primary" type="submit" size="lg">
                                Guardar
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CompAgregarPrenda;
