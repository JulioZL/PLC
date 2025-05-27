import ReportesPrenModel from './ReportesPrenModel.js';
import DetalleReportePrendaModel from './DetalleReportePrendaModel.js';
import PrendasModel from './PrendasModel.js';

// Asociaciones
ReportesPrenModel.hasMany(DetalleReportePrendaModel, {
    foreignKey: 'id_reporteprenda',
    as: 'detalles'
});

DetalleReportePrendaModel.belongsTo(ReportesPrenModel, {
    foreignKey: 'id_reporteprenda',
    as: 'reporte'
});

DetalleReportePrendaModel.belongsTo(PrendasModel, {
    foreignKey: 'id_prenda',
    as: 'prenda'
});
