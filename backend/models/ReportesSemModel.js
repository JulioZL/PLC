import db from "../database/db.js";
import { DataTypes } from "sequelize";
import AlumnosModel from "./AlumnosModel.js";

const ReportesSemModel = db.define('ReportesSemestrales', {
    id_reportesemestral: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_alumno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'AlumnosModel',
            key: 'id_alumno',
        },
    },
    semestre: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    ciclo_escolar: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    fecha_modificacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    fecha_eliminacion: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    estado: {
        type: DataTypes.ENUM('Activo', 'Eliminado'),
        defaultValue: 'Activo',
    }
}, {
    tableName: 'ReportesSemestrales',
    timestamps: false,
});

ReportesSemModel.belongsTo(AlumnosModel, { foreignKey: 'id_alumno' });

export default ReportesSemModel;