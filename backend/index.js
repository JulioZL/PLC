import express from "express";
import cors from 'cors';
import db from "./database/db.js";
import aRoutes from './routes/routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();


const app = express();

// Obtener el directorio actual usando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Habilitar CORS
app.use(cors({
    origin: '*',  // Permitir todos los orígenes (ajústalo según tus necesidades)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Especificar los métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'],  // Especificar los encabezados permitidos
}));

// Parsear JSON
app.use(express.json());

// Servir las rutas del API
app.use('/api', aRoutes);

// Intentar conectar con la base de datos
try {
    db.authenticate()
        .then(() => console.log('Conexión a la base de datos exitosa'))
        .catch((error) => console.error('Error al conectar a la base de datos:', error));

    console.log('Conexión exitosa');
} catch (error) {
    console.log(`El error de conexión es: ${error}`);
}

// Servir los archivos estáticos de React desde la carpeta build
const buildPath = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(buildPath));

// Si no hay coincidencias para las rutas de la API, enviar el index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// Iniciar servidor en el puerto 3001
app.listen(3001, () => {
    console.log('API corriendo en el puerto https://plc-j41x.onrender.com/');
});
