    import db from "../database/db.js";
import { DataTypes } from "sequelize";


const PrendasModel = db.define('prendas', {
    id_prenda: { type: DataTypes.SMALLINT, primaryKey: true, autoIncrement: true },
    nombre_prenda: { type: DataTypes.STRING(25), allowNull: false },
    talla: { type: DataTypes.STRING(2), allowNull: false },
    unidades: { type: DataTypes.SMALLINT, allowNull: false },
    precio: { type: DataTypes.DECIMAL(6, 2), allowNull: false }
}, {
    tableName: 'prendas',
    timestamps: false
});


    export default PrendasModel;

