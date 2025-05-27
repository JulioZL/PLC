import db from "../database/db.js";
import { DataTypes } from "sequelize";

// Definir el modelo para la tabla 'prenda'
const ConceptosPRModel = db.define('prendas', {
    id_prenda: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_prenda'
    },
    nombre_prenda: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'nombre_prenda'
    },
    talla: {
        type: DataTypes.STRING(3),
        allowNull: false,
        field:'talla'
    },
    unidades: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field:'unidades'
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'precio'
    }
}, {
    tableName: 'prendas', // Nombre de la tabla en la base de datos
    timestamps: false
});

export default ConceptosPRModel;
