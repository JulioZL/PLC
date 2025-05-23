import PrendasModel from "../models/PrendasModel.js";

// Mostrar todas las prendas
export const getAllPrendas = async (req, res) => {
    try {
        const prendas = await PrendasModel.findAll();
        res.json(prendas);
    }
    catch (error) {
        res.json({ message: error.message })
    }
}

// Mostrar un registro
export const getPrenda = async (req, res) => {
    try {
        const prenda = await PrendasModel.findAll({
            where: { id_prenda: req.params.id_prenda }
        })
        res.json(prenda)
    }
    catch (error) {
        res.json({ message: error.message })
    }
}

// Crear Registro
export const createPrenda = async (req, res) => {
    try {
        await PrendasModel.create(req.body)
        res.json({
            "message": "Prenda guardada correctamente"
        })
    }
    catch (error) {
        res.json({ message: error.message })
    }
}

// Actualizar registro
export const updatePrenda = async (req, res) => {
    try {
        await PrendasModel.update(req.body, {
            where: { id_prenda: req.params.id_prenda }
        })
        res.json({
            "message": "Prenda actualizada correctamente"
        })
    }
    catch (error) {
        res.json({message: error.message})
    }
}

// Eliminar registro
export const deletePrenda = async (req, res) => {
    try {
        await PrendasModel.destroy({
            where: { id_prenda: req.params.id_prenda }
        })
        res.json({
            "Message": "Prenda eliminada correctamente."
        })
    }
    catch (error) {
        res.json({ message: error.message })
    }
}