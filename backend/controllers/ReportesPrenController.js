import db from "../database/db.js";
import { DataTypes } from "sequelize";
import { QueryTypes } from "sequelize";
import ReportesPrenModel from "../models/ReportesPrenModel.js";

// Insertar un nuevo reporte
export const createReportePrenda = async (req, res) => {
    const reportes = req.body; // Array de reportes enviados desde el frontend

    try {
        for (const reporte of reportes) {
            const {
                Nombre_Alumno,
                Grupo,
                Nombre_Articulo,
                Talla,
                Precio,
                Cantidad,
            } = reporte;

            await db.query(
                'CALL InsertarReportePrenda(:Nombre_Alumno, :Grupo, :Nombre_Articulo, :Talla, :Precio, :Cantidad)',
                {
                    replacements: {
                        Nombre_Alumno,
                        Grupo,
                        Nombre_Articulo,
                        Talla,
                        Precio,
                        Cantidad,
                    },
                    type: QueryTypes.RAW,
                }
            );
        }

        res.status(200).json({ message: 'Reporte(s) guardado(s) correctamente.' });
    } catch (error) {
        console.error('Error al guardar el reporte:', error);
        res.status(500).json({ message: 'Error al guardar el reporte.', error });
    }
};


// Actualizar un reporte
export const actualizarReportePrenda = async (req, res) => {
    const { Id_ReportePrenda } = req.params; 
    const {
        Nombre_Alumno,
        Grupo,
        Nombre_Articulo,
        Talla,
        Precio,
        Cantidad,
        Estado
    } = req.body;

    try {
        await ReportesPrenModel.sequelize.query(
            'CALL ActualizarReportePrenda(:Id_ReportePrenda, :Nombre_Alumno, :Grupo, :Nombre_Articulo, :Talla, :Precio, :Cantidad, :Estado)',
            {
                replacements: {
                    Id_ReportePrenda,
                    Nombre_Alumno,
                    Grupo,
                    Nombre_Articulo,
                    Talla,
                    Precio,
                    Cantidad,
                    Estado 
                },
                type: ReportesPrenModel.sequelize.QueryTypes.RAW
            }
        );

        res.json({
            "message": "Reporte actualizado correctamente"
        })
    } catch (error) {
        console.error('Error al actualizar el reporte:', error);
        res.status(500).json({ message: 'Error al actualizar el reporte.',  error: error.message, // Incluye el mensaje del error
        stack: error.stack});
    }
};

// Eliminar un reporte (marcar como eliminado)
export const eliminarReportePrenda = async (req, res) => {
    const { Id_ReportePrenda } = req.params;

    try {
        await ReportesPrenModel.update(
            {
                Estado: 'Eliminado',  
                Fecha_Eliminacion: new Date()
            },
            {
                where: {
                    Id_ReportePrenda
                }
            });

        res.json({
            message: "Reporte eliminado correctamente (Estado cambiado a 'Eliminado')."
        });
    } catch (error) {
        console.error('Error al eliminar el reporte:', error);
        res.status(500).json({ message: 'Error al eliminar el reporte.', error });
    }
};


// Consultar reportes
export const consultarReportesPrenda = async (req, res) => {
    const { Estado = 'Activo' } = req.query;

    try {
        const Reportes = await ReportesPrenModel.findAll({
            where: {
                Estado: Estado
            }
        });
        res.status(200).json({
            message: 'Reportes obtenidos correctamente.',
            data: Reportes
        });
    } catch (error) {
        console.error('Error al consultar los reportes:', error);
        res.status(500).json({ message: 'Error al consultar los reportes.', error });
    }
};

// Consultar todos los reportes (incluyendo los eliminados)
export const consultarAllReportesPrenda = async (req, res) => {
    const { Estado } = req.query;

    try {

        const reportes = await ReportesPrenModel.findAll();

        res.status(200).json({
            message: 'Reportes obtenidos correctamente.',
            data: reportes
        });
    } catch (error) {
        console.error('Error al consultar los reportes:', error);
        res.status(500).json({ message: 'Error al consultar los reportes.', error });
    }
};