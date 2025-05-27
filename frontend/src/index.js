import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import App from './App';
import ErrorPage from './ErrorPage';
import { ToastContainer } from 'react-toastify';

// Login
import CompInicio from './Login/CompInicio';
import IniciarSesion from './Login/IniciarSesion';
import RegistrarUsuario from './Login/RegistrarUsuario';
import NavBar from './NavBar';

// Contraloría
import InvPrendas from './Contraloria/Inventarios/InvPrendas';
import AgregarPrenda from './Contraloria/Inventarios/AgregarPrenda';
import EditarPrenda from './Contraloria/Inventarios/EditarPrenda';
import CrearReportesSEM from './Contraloria/Reportes/CrearReportesSEM';
import CrearReportesInv from './Contraloria/Reportes/CrearReportesInv';
import EditarReportes from './Contraloria/Reportes/EditarReportes';
import EditarReportesInv from './Contraloria/Reportes/EditarReportesInv';
import HistoricoReportes from './Contraloria/Historico/HistoricoReportes';
import HistoricoReportesInv from './Contraloria/Historico/HistoricoReportesInv';
import AgregarAlumnos from './Contraloria/Alumnos/AgregarAlumnos';
import InformacionUsuarios from './Contraloria/Usuarios/InformacionUsuarios';
import ExportPDFReportes from './Contraloria/Reportes/ExportPDFReportes';

// Rutas
const router = createBrowserRouter([
    {
        path: '/',
        element: <CompInicio />,
        errorElement: <ErrorPage />,
        children: [
            { path: 'iniciarSesion', element: <IniciarSesion /> },
            { path: 'registrarUsuario', element: <RegistrarUsuario /> },
        ],
    },
    {
        path: '/Menu',
        element: <NavBar />,
        errorElement: <ErrorPage />,
        children: [
            { path: 'invPrendas', element: <InvPrendas /> },
            { path: 'agregarPrenda', element: <AgregarPrenda /> },
            { path: 'editarPrenda/:id', element: <EditarPrenda /> },
            { path: 'reportes', element: <CrearReportesSEM /> },
            { path: 'reportesInv', element: <CrearReportesInv /> },
            { path: 'editarReportes', element: <EditarReportes /> },
            { path: 'editarReportesInv', element: <EditarReportesInv /> },
            { path: 'historicoReportes', element: <HistoricoReportes /> },
            { path: 'historicoReportesInv', element: <HistoricoReportesInv /> },
            { path: 'exportPDFReportes', element: <ExportPDFReportes /> },
            { path: 'agregarAlumnos', element: <AgregarAlumnos /> },
            { path: 'informacionUsuarios', element: <InformacionUsuarios /> },
        ],
    },
]);

// Renderizar aplicación
createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <>
            <RouterProvider router={router} />
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    </React.StrictMode>
);
