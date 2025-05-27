import db from "../database/db.js";
import { QueryTypes } from "sequelize";
import LoginModel from "../models/LoginModel.js";

export const getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await LoginModel.findAll();
        res.json(usuarios);
    }
    catch (error) {
        res.json({ message: error.message });
    }
};

export const createUsuario = async (req, res) => {
    const { Nombre, Usuario, Contrasenia, Departamento, rol, domicilio, no_telefono } = req.body;

    try {
        await db.query(
            CALL (InsertarUsuario( Nombre,  Usuario,  Contrasenia,  Departamento,  rol,  domicilio,  no_telefono)),
            {
                replacements: { Nombre, Usuario, Contrasenia, Departamento, rol, domicilio, no_telefono },
                type: QueryTypes.RAW
         }
        );
        res.json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ message: "Error al registrar usuario", error: error.message });
    }
};

export const loginUsuario = async (req, res) => {
    const { Usuario, Contrasenia, Rol } = req.body;
    console.log("Datos recibidos:", { Usuario, Contrasenia, Rol });
    try {
        const user = await LoginModel.findOne({
            where: { Usuario }
        });

        console.log("Datos recibidos:", { Usuario, Contrasenia });

        if (user) {
            // Comparar la contraseña directamente
            if (user.Contrasenia === Contrasenia && user.Rol === Rol) {
                res.json({ message: "Inicio de sesión exitoso", user });
            } else {
                res.status(401).json({ message: "Datos incorrectos." });
            }
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error al procesar la solicitud de inicio de sesión:", error);
        res.status(500).json({ message: "Error del servidor", error: error.message });
    }

};