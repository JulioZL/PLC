import db from "../database/db.js";
import { DataTypes } from "sequelize";
import ReportesPrenModel from "./ReportesPrenModel.js";
import PrendasModel from "./PrendasModel.js";

const DetalleReportePrendaModel = db.define('DetalleReportePrenda', {
    id_detalleprenda: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_reporteprenda: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ReportesPrenModel',
            key: 'id_reporteprenda',
        },
        onDelete: 'CASCADE',
    },
    id_prenda: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'PrendasModel',
            key: 'id_prenda',
        },
    },
    talla: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    total: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.getDataValue('cantidad') * this.getDataValue('precio');
        }
    }

}, {
    tableName: 'DetalleReportePrenda',
    timestamps: false,
});


export default DetalleReportePrendaModel;