import db from "../database/db.js";
import { DataTypes } from "sequelize";

const ReportesPrenModel = db.define('ReportePrenda', {
    Id_ReportePrenda: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'Id_ReportePrenda'  
    },
    Nombre_Alumno: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'Nombre_Alumno'  
    },
    Grupo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'Grupo'
    },
    Nombre_Articulo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'Nombre_Articulo'
    },
    Talla: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'Talla'
    },
    Precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'Precio'
    },
    Cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'Cantidad'
    },
    Estado: {
        type: DataTypes.ENUM('Activo', 'Eliminado'),
        defaultValue: 'Activo',
        field: 'Estado'
    },
    Fecha_Creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        field: 'Fecha_Creacion'
    },
    Fecha_Modificacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
        allowNull: false,
        field: 'Fecha_Modificacion'
    },
    Fecha_Eliminacion: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'Fecha_Eliminacion'
    }
}, {
    tableName: 'reporteprenda',  
    timestamps: false,  
});



export default ReportesPrenModel;
