import axios from 'axios';
import { useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Card, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './CompAgregarPrenda.css';

const URI = 'http://localhost:3001/api/prendas/';

const CompAgregarPrenda = () => {
    const [formData, setFormData] = useState({
        nombrePrenda: '',
        talla: '',
        unidades: '',
        precio: '',
    });
    const [nombre, setNombre] = useState('');
    const [talla, setTalla] = useState('');
    const [unidades, setUnidades] = useState('');
    const [precio, setPrecio] = useState('');

    const navigate = useNavigate();

    // Guardar
    const guardar = async (e) => {
        e.preventDefault();
        await axios.post(URI, {
            nombre_prenda: nombre,
            talla: talla,
            unidades: unidades,
            precio: precio,
        });
        navigate('/menu/InvPrendas');
    };

    return (
        <div className="agregar-prenda-container">
            <h2>Agregar Prenda</h2>
            <div onSubmit={guardar} className="agregar-prenda-content">
                <div className="agregar-prenda-group">
                    <label className="agregar-prenda-label">Nombre</label>
                    <input
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        type="text"
                        className="agregar-prenda-input"
                        placeholder="Ingresa el nombre de la prenda"
                    />
                </div>
                <div className="agregar-prenda-group">
                    <label className="agregar-prenda-label">Talla</label>
                    <>
                        <Form.Control
                            type="text"
                            name="talla"
                            value={formData.talla}
                            onChange={talla}
                            list="tallas"
                            placeholder="Escribe o selecciona la talla"
                        />
                        <datalist id="tallas">
                            {[14, 16, 18, 28, 30, 32, 34, 36, 38, 40, 42, 44, 'CH', 'M', 'G', 'XL', 'UT'].map(tall => (
                                <option key={tall} value={tall} />
                            ))}
                        </datalist>
                    </>

                </div>
                <div className="agregar-prenda-group">
                    <label className="agregar-prenda-label">Unidades</label>
                    <input
                        value={unidades}
                        onChange={(e) => setUnidades(e.target.value)}
                        type="number"
                        min="0"
                        step="s1"
                        className="agregar-prenda-input"
                        placeholder="Cantidad disponible"
                    />
                </div>
                <div className="agregar-prenda-group">
                    <label className="agregar-prenda-label">Precio</label>
                    <input
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        type="number"
                        min="0"
                        step="0.1"
                        className="agregar-prenda-input"
                        placeholder="Precio en MXN"
                    />
                </div>
                <button type="submit" className="agregar-prenda-button">
                    Guardar
                </button>
            </div>
        </div>
    );
};

export default CompAgregarPrenda;
