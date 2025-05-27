import db from "../database/db.js";
import { DataTypes } from "sequelize";
import ReportesSemestrales from "./ReportesSemModel.js";
import ConceptoPagoSemestral from "./ConceptosPSModel.js";

const DetalleReporteSemestralModel = db.define('detalleReporteSemestral', {
    id_detalle_semestral: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_reporte_semestral: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ReportesSemestrales',
            key: 'id_reportesemestral',
        },
        onDelete: 'CASCADE',
    },
    id_concepto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'conceptospagosemestral',
            key: 'idConcepto',
        },
    },
    cantidad: {
        type: DataTypes.SMALLINT,
        allowNull: false,
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    tableName: 'detalleReporteSemestral',
    timestamps: false,
});

DetalleReporteSemestralModel.belongsTo(ReportesSemestrales, { foreignKey: 'id_reporte_semestral' });
DetalleReporteSemestralModel.belongsTo(ConceptoPagoSemestral, { foreignKey: 'id_concepto' });

export default DetalleReporteSemestralModel;