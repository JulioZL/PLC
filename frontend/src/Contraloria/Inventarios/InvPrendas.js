import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import EditarPrenda from './EditarPrenda';
import './InvPrendas.css';

const URI = 'https://plc-j41x.onrender.com/api/prendas/';

const CompMostrarPrendas = () => {
    const [prendas, setPrenda] = useState([]);
    const [visibleCrear, setVisibleCreate] = useState(false);
    const [idP, setId] = useState(null); 

    const rol = sessionStorage.getItem('TUsuario');  
    useEffect(() => {
        getPrendas();
    }, []);

    const getPrendas = async () => {
        const res = await axios.get(URI);
        setPrenda(res.data);
    };

    const deletePrenda = async (id) => {
        await axios.delete(`${URI}${id}`);
        getPrendas();
    };

    const handleEditClick = (id) => {
        setId(id);
        setVisibleCreate(true);
    };

    return (
        <div className="invprendas-container">
    <div className="invprendas-agregar-container">
        {(rol === '1' || rol === '2') && (
            <Link to="/Menu/AgregarPrenda" className="invprendas-agregar">
                Agregar
            </Link>
        )}
    </div>

    <Table striped responsive className="invprendas-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Talla</th>
                <th>Unidades</th>
                <th>Precio</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {prendas.map((prenda) => (
                <tr key={prenda.id_prenda}>
                    <td>{prenda.id_prenda}</td>
                    <td>{prenda.nombre_prenda}</td>
                    <td>{prenda.talla}</td>
                    <td>{prenda.unidades}</td>
                    <td>{prenda.precio}</td>
                    <td className="invprendas-buttons">
                        {(rol === '1' || rol === '2') && (
                            <>
                                <Button
                                    icon={<FaEdit />}
                                    className="btn-edit"
                                    onClick={() => handleEditClick(prenda.id_prenda)}
                                />
                                <Button
                                    icon={<FaTrashAlt />}
                                    className="btn-delete"
                                    onClick={() => deletePrenda(prenda.id_prenda)}
                                />
                            </>
                        )}
                    </td>
                </tr>
            ))}
        </tbody>
    </Table>

    <Dialog
        visible={visibleCrear}
        onHide={() => setVisibleCreate(false)}
        header="Editar Prenda"
        className="invprendas-dialog"
    >
        <EditarPrenda id={idP} />
    </Dialog>
</div>

    );
};

export default CompMostrarPrendas;
