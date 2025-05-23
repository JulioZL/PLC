import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from 'react-bootstrap';  
const URI = 'http://localhost:3001/api/prendas/';

const CompEditarPrenda = ({ id }) => {
    const [nombre, setNombre] = useState('');
    const [talla, setTalla] = useState('');
    const [unidades, setUnidades] = useState('');
    const [precio, setPrecio] = useState('');

    const navigate = useNavigate();

    const actualizar = async (e) => {
        e.preventDefault();
        await axios.put(URI + id, {
            nombre_prenda: nombre,
            talla: talla,
            unidades: unidades,
            precio: precio
        });
        window.location.reload();
    };

    useEffect(() => {
        getPrendaById();
    }, []);

    const getPrendaById = async () => {
        try {
            const res = await axios.get(URI + id);
            if (res.data && res.data.length > 0) {
                const prenda = res.data[0];
                setNombre(prenda.nombre_prenda);
                setTalla(prenda.talla);
                setUnidades(prenda.unidades);
                setPrecio(prenda.precio);
            }
        } catch (error) {
            console.error("Error al obtener la prenda", error);
        }
    };

    return (
        <div className="p-4">
            <Form onSubmit={actualizar}>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Nombre de la prenda"
                        className="form-control-lg"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Talla</Form.Label>
                    <Form.Control
                        type="text"
                        value={talla}
                        onChange={(e) => setTalla(e.target.value)}
                        placeholder="Talla de la prenda"
                        className="form-control-lg"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Unidades</Form.Label>
                    <Form.Control
                        type="number"
                        min="0"
                        step="1"
                        value={unidades}
                        onChange={(e) => setUnidades(e.target.value)}
                        placeholder="Unidades disponibles"
                        className="form-control-lg"
                        required
                        min="0"
                    />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control
                        type="number"
                        min="0"
                        step="0.1"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        placeholder="Precio de la prenda"
                        className="form-control-lg"
                        required
                        
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="btn-lg w-100">
                    Guardar cambios
                </Button>
            </Form>
        </div>
    );
};

export default CompEditarPrenda;
