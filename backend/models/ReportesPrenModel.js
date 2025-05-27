import db from "../database/db.js";
import { DataTypes } from "sequelize";
import AlumnosModel from "./AlumnosModel.js";
import DetalleReportePrendaModel from "./DetalleReportePrendaModel.js";

const ReportesPrenModel = db.define('ReportePrenda', {
    id_reporteprenda: {
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
    estado: {
        type: DataTypes.ENUM('Activo', 'Eliminado'),
        defaultValue: 'Activo',
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
    semestre: {
        type: DataTypes.STRING(5),
        allowNull: false,
        defaultValue: '1',
    }
}, {
    tableName: 'ReportePrenda',
    timestamps: false,
});


ReportesPrenModel.belongsTo(AlumnosModel, {
    foreignKey: 'id_alumno',
    as: 'alumno'
});

export default ReportesPrenModel;