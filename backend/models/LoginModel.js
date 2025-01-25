import db from "../database/db.js";
import { DataTypes } from "sequelize";

const LoginModel = db.define('usuarios', {
    id_usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Nombre: { type: DataTypes.STRING(64), allowNull: false },
    Usuario: { type: DataTypes.STRING(64), allowNull: false },
    Contrasenia: { type: DataTypes.STRING(64), allowNull: false },
    Departamento: { type: DataTypes.STRING(64), allowNull: false },
    Rol: { type: DataTypes.INTEGER(64), allowNull: false },
    domicilio: { type: DataTypes.STRING(128), allowNull: false },
    no_telefono: { type: DataTypes.STRING(15), allowNull: false }
}, {
    tableName: 'usuarios',
    timestamps: false
});

export default LoginModel;
