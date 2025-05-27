import PrendasModel from "../models/PrendasModel.js";
import DetalleReportePrendaModel from "../models/DetalleReportePrendaModel.js"

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
        const { nombre_prenda, talla } = req.body;

        // Buscar si ya existe una prenda con el mismo nombre y talla
        const existente = await PrendasModel.findOne({
            where: {
                nombre_prenda,
                talla
            }
        });

        if (existente) {
            return res.status(400).json({
                message: "Ya existe una prenda con ese nombre y esa talla."
            });
        }

        // Si no existe, se crea
        await PrendasModel.create(req.body);
        res.json({
            message: "Prenda guardada correctamente"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsoPrenda = async (req, res) => {
    try {
        const usada = await DetalleReportePrendaModel.findOne({
            where: { id_prenda: req.params.id_prenda }
        });

        res.json({ enUso: !!usada });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar registro
export const updatePrenda = async (req, res) => {
    try {
        const id = req.params.id_prenda;
        const { nombre_prenda, talla, unidades, precio } = req.body;

        // Verificar si la prenda está en uso en algún reporte
        const usadaEnReporte = await DetalleReportePrendaModel.findOne({
            where: { id_prenda: id }
        });

        const prendaExistente = await PrendasModel.findByPk(id);

        if (usadaEnReporte) {
            // Verificar si se intenta cambiar talla o nombre
            if (talla !== prendaExistente.talla) {
                return res.status(400).json({
                    message: "No se puede cambiar la talla porque la prenda ya está en uso en un reporte"
                });
            }

            if (nombre_prenda !== prendaExistente.nombre_prenda) {
                return res.status(400).json({
                    message: "No se puede cambiar el nombre porque la prenda ya está en uso en un reporte"
                });
            }

            // Solo se actualizan unidades y precio
            await PrendasModel.update(
                { unidades, precio },
                { where: { id_prenda: id } }
            );
        } else {
            // Si no está en uso, actualizar todo normalmente
            await PrendasModel.update(
                { nombre_prenda, talla, unidades, precio },
                { where: { id_prenda: id } }
            );
        }

        res.json({ message: "Prenda actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Eliminar registro
export const deletePrenda = async (req, res) => {
    try {
        const id = parseInt(req.params.id_prenda); // <- conversión explícita
        const deleted = await PrendasModel.destroy({
            where: { id_prenda: id }
        });

        if (deleted === 0) {
            return res.status(404).json({ message: 'Prenda no encontrada.' });
        }

        res.json({ message: 'Prenda eliminada correctamente.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
