import axios from "axios";
import { useEffect, useState } from "react";
import { Form, Button } from 'react-bootstrap';
import { toast } from "react-toastify";
import config from '../../config';


const CompEditarPrenda = ({ id, onSuccess }) => {
    const [formData, setFormData] = useState({
        nombrePrenda: '',
        talla: '',
        unidades: '',
        precio: '',
    });

    const URI = config.URI + 'api/prendas/';

    const tallasDisponibles = [
        14, 16, 18, 28, 30, 32, 34, 36, 38, 40, 42, 44, 'CH', 'MD', 'GD', 'XL', 'UT', 'NA',
    ];

    const [tallaEditable, setTallaEditable] = useState(true);
    const [enUso, setEnUso] = useState(false);

    useEffect(() => {
        getPrendaById();
    }, []);

    const getPrendaById = async () => {
        try {
            const res = await axios.get(URI + id);
            if (res.data && res.data.length > 0) {
                const prenda = res.data[0];
                setFormData({
                    nombrePrenda: prenda.nombre_prenda,
                    talla: prenda.talla,
                    unidades: prenda.unidades,
                    precio: prenda.precio,
                });

                // Verifica si está en uso
                const resUso = await axios.get(URI+id+'/en-uso');
                setTallaEditable(!resUso.data.enUso);
                setEnUso(resUso.data.enUso);
            }
        } catch (error) {
            console.error("Error al obtener la prenda", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const actualizar = async (e) => {
        e.preventDefault();

        try {
            await axios.put(URI + id, {
                nombre_prenda: formData.nombrePrenda,
                talla: formData.talla,
                unidades: formData.unidades,
                precio: formData.precio
            });
            toast.success('Artículo actualizado correctamente.');
            if (onSuccess) onSuccess();
        } catch (err) {
            if (
                err.response &&
                err.response.status === 400 &&
                err.response.data.message?.includes('talla')
            ) {
                toast.warning('No se puede cambiar la talla porque la prenda ya está en uso en un reporte.');
            } else {
                toast.error('Error al actualizar el artículo, revisa los datos ingresados.');
            }
        }
    };


    return (
        <div className="p-4">
            <Form onSubmit={actualizar}>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        name="nombrePrenda"
                        value={formData.nombrePrenda}
                        onChange={handleChange}
                        placeholder="Nombre del artículo"
                        className="form-control-lg"
                        disabled={enUso} // Desactiva si está en uso
                        required
                    />
                    {enUso && (
                        <small className="text-danger d-block mt-1">
                            Artículo en uso
                        </small>
                    )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="talla">
                    <Form.Label>Talla</Form.Label>
                    <Form.Select
                        name="talla"
                        value={formData.talla}
                        onChange={handleChange}
                        disabled={!tallaEditable}
                        required
                    >
                        <option value="">Selecciona una talla</option>
                        {tallasDisponibles.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </Form.Select>
                    {enUso && (
                        <small className="text-danger d-block mt-1">
                            Artículo en uso
                        </small>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Unidades</Form.Label>
                    <Form.Control
                        type="number"
                        name="unidades"
                        min="0"
                        step="1"
                        value={formData.unidades}
                        onChange={handleChange}
                        placeholder="Unidades disponibles"
                        className="form-control-lg"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control
                        type="number"
                        name="precio"
                        min="0"
                        step="1"
                        value={formData.precio}
                        onChange={handleChange}
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
