import db from "../database/db.js";
import { DataTypes } from "sequelize";

const AlumnosModel = db.define('alumnos', {
    id_alumno: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    NombreAlumno: { type: DataTypes.STRING(100), allowNull: false }
}, {
    tableName: 'alumnos',
    timestamps: false
});

export default AlumnosModel;
