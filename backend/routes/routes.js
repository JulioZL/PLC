import express from 'express'
import { createUsuario, getAllUsuarios, loginUsuario/*, getUsuario*/ } from '../controllers/LoginController.js'
import { getAllPrendas, getPrenda,createPrenda, updatePrenda, deletePrenda  } from '../controllers/PrendasController.js'
import { createReporte, actualizarReporte, consultarReportes, eliminarReporte, consultarAllReportes } from '../controllers/ReportesSemController.js';
import { createReportePrenda, actualizarReportePrenda, consultarReportesPrenda, eliminarReportePrenda, consultarAllReportesPrenda } from '../controllers/ReportesPrenController.js';
import { searchAlumnoByName } from '../controllers/AlumnosController.js';
import { getAllConceptos } from '../controllers/ConceptosPSController.js';


const router = express.Router()

router.get('/prendas', getAllPrendas)
router.get('/prendas/:id_prenda', getPrenda)
router.post('/prendas', createPrenda)
router.put('/prendas/:id_prenda', updatePrenda)
router.delete('/prendas/:id_prenda', deletePrenda)

router.get('/usuarios', getAllUsuarios)
//router.get('/usuarios/:usuario', getUsuario)
router.post('/login', loginUsuario);
router.post('/register', createUsuario);

router.post('/reportes', createReporte);
router.get('/reportes', consultarReportes);
router.get('/reportes/all', consultarAllReportes);
router.put('/reportes/:Id_ReporteSemestral', actualizarReporte);
router.put('/reportes/eliminar/:Id_ReporteSemestral', eliminarReporte);
router.get('/alumnos', searchAlumnoByName);

router.post('/reportesPrenda', createReportePrenda);
router.get('/reportesPrenda', consultarReportesPrenda);
router.get('/reportesPrenda/all', consultarAllReportesPrenda);
router.put('/reportesPrenda/:Id_ReportePrenda', actualizarReportePrenda);
router.put('/reportesPrenda/eliminar/:Id_ReportePrenda', eliminarReportePrenda);

router.get('/conceptos', getAllConceptos);

export default router