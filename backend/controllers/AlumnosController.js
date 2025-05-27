import db from "../database/db.js";
import { Sequelize } from "sequelize";
import AlumnosModel from "../models/AlumnosModel.js";

export const searchAlumnoByName = async (req, res) => {
    try {
        const { NombreAlumno } = req.query;

        // Validamos si se pasó el nombre
        if (!NombreAlumno || NombreAlumno.trim() === '') {
            return res.status(400).json({ error: 'El nombre es requerido para la búsqueda' });
        }

        // Realizamos la búsqueda con un filtro que se ajusta al nombre parcial
        const alumnos = await AlumnosModel.findAll({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('NombreAlumno')),
                'LIKE',
                `%${NombreAlumno.toLowerCase()}%`
            ),
            limit: 10
        });

        return res.status(200).json(alumnos);
    } catch (error) {
        console.error('Error al buscar alumnos:', error);
        return res.status(500).json({ error: error.message || 'Ocurrió un error al realizar la búsqueda' });
    }
};

export const createAlumno = async (req, res) => {
    try {
        await AlumnosModel.create(req.body)
        res.json({
            "message": "Alumno guardado correctamente"
        })
    }
    catch (error) {
        res.json({ message: error.message })
    }
}

export const updateAlumno = async (req, res) => {
    try {
        await PrendasModel.update(req.body, {
            where: {id_alumno: req.params.id_alumno }
        })
        res.json({
            "message": "Alumno actualizado correctamente"
        })
    }
    catch (error) {
        res.json({ message: error.message })
    }
}

export const deleteAlumno = async (req, res) => {
    try {
        await AlumnosModel.destroy({
            where: { id_alumno: req.params.id_alumno }
        })
        res.json({
            "Message": "Alumno eliminado correctamente."
        })
    }
    catch (error) {
        res.json({ message: error.message })
    }
}