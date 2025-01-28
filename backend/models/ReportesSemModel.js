import db from "../database/db.js";
import { DataTypes } from "sequelize";

const ReportesSemModel = db.define('ReportesSemestrales', {
    Id_ReporteSemestral: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'Id_ReporteSemestral'  
    },
    Nombre_Alumno: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'Nombre_Alumno'  
    },
    Semestre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'Semestre'
    },
    Grupo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'Grupo'
    },
    Concepto: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'Concepto'
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
    Total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'Total',
        get() {
            const precio = this.getDataValue('Precio');
            const cantidad = this.getDataValue('Cantidad');
            return precio * cantidad;
        }
    },
    Mes_de_Pago: {
        type: DataTypes.ENUM('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'),
        allowNull: false,
        field: 'Mes_de_Pago'
    },
    Ciclo_Escolar: {
        type: DataTypes.ENUM('Enero - Junio', 'Agosto - Diciembre'),
        allowNull: false,
        field: 'Ciclo_Escolar'
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
    },
    Estado: {
        type: DataTypes.ENUM('Activo', 'Eliminado'),
        defaultValue: 'Activo',
        field: 'Estado'
    }
}, {
    tableName: 'ReportesSemestrales',  
    timestamps: false,  
});



export default ReportesSemModel;
