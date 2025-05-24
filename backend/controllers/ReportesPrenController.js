import db from "../database/db.js";
import ReportesPrenModel from "../models/ReportesPrenModel.js";
import DetalleReportePrendaModel from "../models/DetalleReportePrendaModel.js";
import AlumnosModel from "../models/AlumnosModel.js";
import PrendasModel from "../models/PrendasModel.js";

// --- FUNCIONES AUXILIARES ---

/**
 * Obtener alumno por nombre
 */
async function getAlumnoPorNombre(nombre, transaction) {
    return AlumnosModel.findOne({
        where: { NombreAlumno: nombre.trim() },
        transaction,
    });
}

/**
 * Obtener prenda por nombre
 */
async function getPrendaPorNombre(nombre, transaction) {
    return PrendasModel.findOne({
        where: { nombre_prenda: nombre.trim() },
        transaction,
    });
}

/**
 * Validar que hay inventario suficiente y descontar la cantidad
 */
async function validarYDescontarInventario(prenda, cantidad, transaction) {
    if (!prenda) throw new Error("Prenda no encontrada");

    if (prenda.unidades < cantidad) {
        throw new Error(
            `No hay suficientes unidades de ${prenda.nombre_prenda}. Disponibles: ${prenda.unidades}, solicitadas: ${cantidad}`
        );
    }

    prenda.unidades -= cantidad;
    await prenda.save({ transaction });
}

/**
 * Devolver inventario de prendas (cuando se elimina un detalle)
 */
async function devolverInventario(detalles, idsAEliminar, transaction) {
    const detallesParaDevolver = detalles.filter(d => idsAEliminar.includes(d.id_detalleprenda));

    for (const detalle of detallesParaDevolver) {
        const prenda = await PrendasModel.findByPk(detalle.id_prenda, { transaction });
        if (prenda) {
            prenda.unidades += detalle.cantidad;
            await prenda.save({ transaction });
        }
    }
}

// --- CONTROLADORES ---

/**
 * Crear reporte prenda con detalles y control de inventario
 */
export const createReportePrenda = async (req, res) => {
    const data = req.body;

    if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ message: "Datos inválidos o vacíos" });
    }

    const transaction = await db.transaction();

    try {
        const alumno = await getAlumnoPorNombre(data[0].Nombre_Alumno, transaction);
        if (!alumno) {
            await transaction.rollback();
            return res.status(404).json({ message: "Alumno no encontrado" });
        }

        const nuevoReporte = await ReportesPrenModel.create({
            id_alumno: alumno.id_alumno,
            semestre: data[0].Semestre,
            estado: "Activo",
        }, { transaction });

        // Procesar cada prenda en paralelo
        await Promise.all(
            data.map(async (item) => {
                const prenda = await getPrendaPorNombre(item.Nombre_Articulo, transaction);
                await validarYDescontarInventario(prenda, item.Cantidad, transaction);

                return DetalleReportePrendaModel.create({
                    id_reporteprenda: nuevoReporte.id_reporteprenda,
                    id_prenda: prenda.id_prenda,
                    talla: item.Talla,
                    cantidad: item.Cantidad,
                    precio: item.Precio,
                }, { transaction });
            })
        );

        await transaction.commit();
        return res.status(200).json({ message: "Reporte y detalles guardados correctamente" });

    } catch (error) {
        await transaction.rollback();
        console.error("Error al crear el reporte:", error.message || error);
        return res.status(500).json({ message: error.message || "Error al guardar el reporte" });
    }
};

/**
 * Consultar todos los reportes (sin detalles)
 */
export const consultarAllReportesPrenda = async (req, res) => {
    try {
        const reportes = await ReportesPrenModel.findAll();
        return res.status(200).json({ message: "Reportes obtenidos correctamente.", data: reportes });
    } catch (error) {
        console.error("Error al consultar los reportes:", error);
        return res.status(500).json({ message: "Error al consultar los reportes." });
    }
};

/**
 * Consultar reportes activos con detalles y relaciones
 */
export const getReportesPrenda = async (req, res) => {
    try {
        const reportes = await ReportesPrenModel.findAll({
            where: { estado: "Activo" },
            include: [
                {
                    model: DetalleReportePrendaModel,
                    as: "detalles",
                    include: [
                        { model: PrendasModel, as: "prenda", attributes: ["nombre_prenda"] },
                    ],
                },
                {
                    model: AlumnosModel,
                    as: "alumno",
                    attributes: ["NombreAlumno"],
                },
            ],
        });

        return res.status(200).json({ success: true, data: reportes });
    } catch (error) {
        console.error("Error al obtener los reportes:", error);
        return res.status(500).json({ success: false, message: "Error al obtener los reportes" });
    }
};

/**
 * Actualizar reporte prenda y sus detalles
 */
export const actualizarReportePrenda = async (req, res) => {
    const { id_reporteprenda, semestre, articulos } = req.body;
    const transaction = await db.transaction();

    try {
        // Buscar reporte
        const reporte = await ReportesPrenModel.findByPk(id_reporteprenda, { transaction });
        if (!reporte) {
            await transaction.rollback();
            return res.status(404).json({ message: "Reporte no encontrado" });
        }

        // Actualizar semestre
        reporte.semestre = semestre;
        await reporte.save({ transaction });

        // Obtener detalles actuales
        const detallesExistentes = await DetalleReportePrendaModel.findAll({
            where: { id_reporteprenda },
            transaction,
        });

        const idsActuales = articulos.map(a => a.id_detalleprenda).filter(Boolean);
        const idsEnBD = detallesExistentes.map(d => d.id_detalleprenda);

        // Detectar detalles eliminados
        const detallesAEliminar = idsEnBD.filter(id => !idsActuales.includes(id));

        // Devolver inventario de detalles eliminados
        await devolverInventario(detallesExistentes, detallesAEliminar, transaction);

        // Eliminar detalles removidos
        await DetalleReportePrendaModel.destroy({
            where: { id_detalleprenda: detallesAEliminar },
            transaction,
        });

        // Procesar articulos para actualizar o crear
        for (const item of articulos) {
            const prenda = await getPrendaPorNombre(item.nombreArticulo, transaction);
            if (!prenda) {
                await transaction.rollback();
                return res.status(404).json({ message: `Prenda no encontrada: ${item.nombreArticulo}` });
            }

            if (item.id_detalleprenda) {
                // Actualizar detalle existente
                const detalle = await DetalleReportePrendaModel.findByPk(item.id_detalleprenda, { transaction });
                if (!detalle) {
                    await transaction.rollback();
                    return res.status(404).json({ message: "Detalle no encontrado para edición" });
                }

                const diferencia = item.cantidad - detalle.cantidad;

                if (diferencia > 0 && prenda.unidades < diferencia) {
                    await transaction.rollback();
                    return res.status(400).json({
                        message: `No hay suficientes unidades de ${item.nombreArticulo}. Solo disponibles: ${prenda.unidades}`,
                    });
                }

                prenda.unidades -= diferencia;
                await prenda.save({ transaction });

                await detalle.update({
                    id_prenda: prenda.id_prenda,
                    talla: item.talla,
                    cantidad: item.cantidad,
                    precio: item.precio,
                }, { transaction });

            } else {
                // Crear nuevo detalle
                await validarYDescontarInventario(prenda, item.cantidad, transaction);

                await DetalleReportePrendaModel.create({
                    id_reporteprenda,
                    id_prenda: prenda.id_prenda,
                    talla: item.talla,
                    cantidad: item.cantidad,
                    precio: item.precio,
                }, { transaction });
            }
        }

        await transaction.commit();
        return res.status(200).json({ message: "Reporte actualizado correctamente" });

    } catch (error) {
        await transaction.rollback();
        console.error("Error al actualizar reporte:", error.message || error);
        return res.status(500).json({ message: error.message || "Error al actualizar reporte" });
    }
};

/**
 * Eliminar reporte (solo cambia estado)
 */
export const eliminarReportePrenda = async (req, res) => {
    const { id_reporteprenda } = req.params;

    try {
        const result = await ReportesPrenModel.update({
            estado: "Eliminado",
            fecha_eliminacion: new Date(),
        }, {
            where: { id_reporteprenda }
        });

        if (result[0] === 0) {
            return res.status(404).json({ message: "No se encontró el reporte con ese ID." });
        }

        return res.json({ message: "Reporte eliminado correctamente (estado cambiado a 'Eliminado')." });
    } catch (error) {
        console.error("Error al eliminar el reporte:", error);
        return res.status(500).json({ message: "Error al eliminar el reporte." });
    }
};