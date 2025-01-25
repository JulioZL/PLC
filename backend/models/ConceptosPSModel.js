import db from "../database/db.js";
import { DataTypes } from "sequelize";

// Definir el modelo para la tabla 'conceptospagosemestral'
const ConceptosPSModel = db.define('ConceptosPagoSemestral', {
    idConcepto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'idConcepto'
    },
    nombreConcepto: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'nombreConcepto'
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'precio'
    }
}, {
    tableName: 'conceptospagosemestral', // Nombre de la tabla en la base de datos
    timestamps: false // Si no tienes campos de tipo fecha de creación/modificación
});

export default ConceptosPSModel;
