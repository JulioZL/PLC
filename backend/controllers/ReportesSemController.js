import db from "../database/db.js";
import { DataTypes } from "sequelize";
import { QueryTypes } from "sequelize";
import ReportesSemModel from "../models/ReportesSemModel.js";

// Insertar un nuevo reporte
export const createReporte = async (req, res) => {
    const {
        Nombre_Alumno,
        Semestre,
        Grupo,
        Concepto,
        Precio,
        Cantidad,
        Mes_de_Pago,
        Ciclo_Escolar
    } = req.body;

    try {
        await db.query(
            'CALL InsertarReporteSemestral(:Nombre_Alumno, :Semestre, :Grupo, :Concepto, :Precio, :Cantidad, :Mes_de_Pago, :Ciclo_Escolar)',
            {
                replacements: {
                    Nombre_Alumno,
                    Semestre,
                    Grupo,
                    Concepto,
                    Precio,
                    Cantidad,
                    Mes_de_Pago,
                    Ciclo_Escolar
                },
                type: QueryTypes.RAW
            }
        );
        res.json({ message: "Reporte generado correctamente" });
    } catch (error) {
        console.error('Error al generar el reporte:', error);
        res.status(500).json({ message: 'Error al generar el reporte.', error });
    }
};

// Actualizar un reporte
export const actualizarReporte = async (req, res) => {
    const { Id_ReporteSemestral } = req.params; 
    const {
        Nombre_Alumno,
        Semestre,
        Grupo,
        Concepto,
        Precio,
        Cantidad,
        Mes_de_Pago,
        Ciclo_Escolar,
        Estado
    } = req.body;

    try {
        await ReportesSemModel.sequelize.query(
            'CALL ActualizarReporteSemestral(:Id_ReporteSemestral, :Nombre_Alumno, :Semestre, :Grupo, :Concepto, :Precio, :Cantidad, :Mes_de_Pago, :Ciclo_Escolar, :Estado)',
            {
                replacements: {
                    Id_ReporteSemestral,
                    Nombre_Alumno,
                    Semestre,
                    Grupo,
                    Concepto,
                    Precio,
                    Cantidad,
                    Mes_de_Pago,
                    Ciclo_Escolar,
                    Estado 
                },
                type: ReportesSemModel.sequelize.QueryTypes.RAW
            }
        );

        res.json({
            "message": "Reporte actualizado correctamente"
        })
    } catch (error) {
        console.error('Error al actualizar el reporte:', error);
        res.status(500).json({ message: 'Error al actualizar el reporte.', error });
    }
};

// Eliminar un reporte (marcar como eliminado)
export const eliminarReporte = async (req, res) => {
    const { Id_ReporteSemestral } = req.params;

    try {
        await ReportesSemModel.update(
            {
                Estado: 'Eliminado',  
                Fecha_Eliminacion: new Date()
            },
            {
                where: {
                    Id_ReporteSemestral
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
export const consultarReportes = async (req, res) => {
    const { Estado = 'Activo' } = req.query;

    try {
        const Reportes = await ReportesSemModel.findAll({
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
export const consultarAllReportes = async (req, res) => {
    const { Estado } = req.query;

    try {

        const reportes = await ReportesSemModel.findAll();

        res.status(200).json({
            message: 'Reportes obtenidos correctamente.',
            data: reportes
        });
    } catch (error) {
        console.error('Error al consultar los reportes:', error);
        res.status(500).json({ message: 'Error al consultar los reportes.', error });
    }
};