import db from "../database/db.js";
import { Sequelize } from "sequelize";
import AlumnosModel from "../models/AlumnosModel.js";

export const searchAlumnoByName = async (req, res) => {
    try {
        const { NombreAlumno } = req.query;

        // Validamos si se pas� el nombre
        if (!NombreAlumno || NombreAlumno.trim() === '') {
            return res.status(400).json({ error: 'El nombre es requerido para la b�squeda' });
        }

        // Realizamos la b�squeda con un filtro que se ajusta al nombre parcial
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
        return res.status(500).json({ error: error.message || 'Ocurri� un error al realizar la b�squeda' });
    }
};