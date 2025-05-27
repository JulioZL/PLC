import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ErrorPage from './ErrorPage';
//login
import CompInicio from './Login/CompInicio';
import IniciarSesion from './Login/IniciarSesion';
import RegistrarUsuario from './Login/RegistrarUsuario';
import NavBar from './NavBar';
//contraloria
import './index.css'
import 'primereact/resources/themes/saga-blue/theme.css';  // Tema de PrimeReact
import 'primereact/resources/primereact.min.css'; // Estilos de PrimeReact

import 'bootstrap/dist/css/bootstrap.min.css';


// Importacion para creacion de rutas y navegacion
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import InvPrendas from './Contraloria/Inventarios/InvPrendas';
import AgregarPrenda from './Contraloria/Inventarios/AgregarPrenda';
import EditarPrenda from './Contraloria/Inventarios/EditarPrenda';
import CrearReportesSEM from './Contraloria/Reportes/CrearReportesSEM';
import CrearReportesInv from './Contraloria/Reportes/CrearReportesInv';
import EditarReportes from './Contraloria/Reportes/EditarReportes';
import EditarReportesInv from './Contraloria/Reportes/EditarReportesInv';
import HistoricoReportes from './Contraloria/Reportes/HistoricoReportes';
import HistoricoReportesInv from './Contraloria/Reportes/HistoricoReportes';
import AgregarAlumnos from './Contraloria/Alumnos/AgregarAlumnos';
import InformacionUsuarios from './Contraloria/Usuarios/InformacionUsuarios';
import ExportPDFReportes from './Contraloria/Reportes/ExportPDFReportes';


// Variable que controla las rutas
const router = createBrowserRouter([
    {
        path: "/",
        element: <CompInicio />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "iniciarSesion",
                element: <IniciarSesion />,
            },
        ],
    },
    {
        path: "/Menu",
        element: <NavBar />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "invPrendas",
                element: <InvPrendas />,
            },
            {
                path: "agregarPrenda",
                element: <AgregarPrenda />,
            },
            {
                path: "editarPrenda/:id",
                element: <EditarPrenda />,
            },
            {
                path: "reportes",
                element: <CrearReportesSEM />
            },
            {
                path: "reportesInv",
                element: <CrearReportesInv />
            },
            {
                path: "editarReportes",
                element: <EditarReportes />
            },
            {
                path: "editarReportesInv",
                element: <EditarReportesInv />
            },
            {
                path: "historicoReportes",
                element: <HistoricoReportes />
            },
            {
                path: "historicoReportesInv",
                element: <HistoricoReportesInv />
            },
            {
                path: "exportPDFReportes",
                element: <ExportPDFReportes />
            },
            {
                path: "agregarAlumnos",
                element: <AgregarAlumnos />
            },
            {
                path: "informacionUsuarios",
                element: <InformacionUsuarios />
            },
            {
                path: "registrarUsuario",
                element: <RegistrarUsuario />,
            }, 
        ],
    },
]);

// Crea la rua y la renderiza en base a root, root es tu raiz principal, esta es tu raiz principal
ReactDOM.createRoot(document.getElementById('root')).render(
    // Modo estricto unicamente para desarrollo
    //<StrictMode>
    < RouterProvider router={router} />
    //</StrictMode>,
);


//Se crea la funcion para retornar la lista de rutas creadas
function index() {
    return <RouterProvider router={router} />
}

export default index;