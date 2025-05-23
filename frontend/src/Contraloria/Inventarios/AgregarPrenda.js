import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompAgregarPrenda.css';

const URI = 'https://plc-j41x.onrender.com/api/prendas/';

const CompAgregarPrenda = () => {
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
            <form onSubmit={guardar} className="agregar-prenda-content">
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
                    <input
                        value={talla}
                        onChange={(e) => setTalla(e.target.value)}
                        type="text"
                        className="agregar-prenda-input"
                        placeholder="Ingresa la talla"
                    />
                </div>
                <div className="agregar-prenda-group">
                    <label className="agregar-prenda-label">Unidades</label>
                    <input
                        value={unidades}
                        onChange={(e) => setUnidades(e.target.value)}
                        type="number"
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
                        step="0.01"
                        className="agregar-prenda-input"
                        placeholder="Precio en MXN"
                    />
                </div>
                <button type="submit" className="agregar-prenda-button">
                    Guardar
                </button>
            </form>
        </div>
    );
};

export default CompAgregarPrenda;
