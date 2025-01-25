// Llamada a Css unicamente del componente
import './App.css';
import 'primereact/resources/themes/saga-blue/theme.css'; // Cambia "saga-blue" por el tema que elijas
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css'; // Para los iconos de Prime
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


// Funcion principal App
const App = () => {

    // inicio

    const navigate = useNavigate();

    const aux = 1;
    sessionStorage.setItem('usuario', aux);
    const variable = sessionStorage.getItem('usuario');

    const inicioSesion = () => {
        if (variable == 1) {
            navigate('/moduloAdmin');
        }
    }



    useEffect(() => {

    });


    // Aqui va todo el codigo de logica, sumas, restas, consulta de datos al servidor, etc.


    // fin

    // Retorna los componentes visuales que el usuario puede ver e interactuar
    return (


        <Container fluid className="px-0">

        </Container>




    );
}

// Se hace la exportacion para que se mestre en root (Main)
export default App;
